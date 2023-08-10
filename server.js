const express = require("express");
const app = express();
const mongoose = require("mongoose")
const Booking = require("./models/booking")
const Rooms = require("./models/rooms")
const PORT = 6000;
require('dotenv')


app.use(express.json())

app.get("/",(req,res)=>{
    res.send("API created for Booking: /booking and Rooms: /rooms");
})
//create database for bookings
app.post("/booking", async (req, res) => {
    try {
      const booking = await Booking.create(req.body);
      res.status(200).json(booking);
      console.log(booking)
    } catch (error) {
      res.status(404).json({error});
    }
  });
//create database for rooms
app.post("/rooms", async (req, res) => {
    try {
      const rooms = await Rooms.create(req.body);
      res.status(200).json(rooms);
    } catch (error) {
      res.status(404).json({error});
    }
  });
// to get booking details from database
app.get("/bookings", async (req, res) => {
    try {
      const booking = await Booking.find({});
      res.status(200).json(booking);
    } catch (err) {
      res.status(500).json({err});
    }
  });
  // to get rooms details from database
app.get("/rooms", async (req, res) => {
    try {
      const rooms = await Rooms.find({});
      res.status(200).json(rooms);
    } catch (err) {
      res.status(500).json({err});
    }
  });
  //List all  Rooms with Booked Data
app.get("/rooms/booked", async (req, res) => {
    try {
      const roomsWithBookings = await Rooms.aggregate([
        {
          $lookup: {
            from: "bookings", // Assuming the collection name for bookings is "bookings"
            localField: "Room_ID",
            foreignField: "Room_ID",
            as: "bookingsData",
          },
        },
        {
          $project: {
            Room_ID: 1,
            bookings: {
              $map: {
                input: "$bookingsData",
                as: "booking",
                in: {
                  room_id: "$Room_ID",
                  booked_status: "$$booking.Booked_Status",
                  customername: "$$booking.CustomerName",
                  date: "$$booking.Date",
                  starttime: "$$booking.StartTime",
                  endtime: "$$booking.EndTime",
                },
              },
            },
          },
        },
      ]);
  
      res.json(roomsWithBookings);
    } catch (error) {
      res.status(500).json({error});
    }
  });
  
  // List all Customers with Booked Data
  app.get("/customers/booked", async (req, res) => {
    try {
      const customersWithBookings = await Booking.aggregate([
        {
          $project: {
            _id: 0,
            room_id: "$Room_ID",
            customername: "$customerName", // <-- Fix the field name here
            date: "$Date",
            starttime: "$StartTime",
            endtime: "$EndTime",
          },
        },
        {
          $group: {
            _id: "$customername",
            bookings: {
              $push: {
                room_id: "$room_id",
                date: "$date",
                starttime: "$starttime",
                endtime: "$endtime",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            customername: "$_id",
            bookings: 1,
          },
        },
      ]);
  
      res.json(customersWithBookings);
    } catch (error) {
      res
        .status(500)
        .json({error});
    }
  });
  // List how many times a customer has booked a room
  app.get("/customers/booking-count", async (req, res) => {
    try {
      const customerBookingCount = await Booking.aggregate([
        {
          $group: {
            _id: {
              room_id: "$Room_ID",
              customername: "$customerName",
            },
            date: { $first: "$Date" },
            starttime: { $first: "$StartTime" },
            endtime: { $first: "$EndTime" },
            booking_id: { $first: "$BookingId" },
            booking_status: { $first: "$Booking_Status" },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            room_id: "$_id.room_id",
            customername: "$_id.customername",
            date: 1,
            starttime: 1,
            endtime: 1,
            booking_id: 1,
            booking_status: 1,
            count: 1,
          },
        },
      ]);
  
      res.json(customerBookingCount);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer booking count" });
    }
  });
  
  app.get("/rooms", async (req, res) => {
    try {
      const room = await Rooms.find({});
      res.status(200).json({ room, message: `Rooms are availbale` });
    } catch (error) {
      res.status(404).json({ error: `The Rooms is not available` });
    }
  });
  
  app.get("/booking", async (req, res) => {
    try {
      const book = await Booking.find({});
      res.status(200).json({ book, message: `Booked` });
    } catch (error) {
      res.status(404).json({ error: `The Booking is not available` });
    }
  });
 
app.listen(PORT,()=>{
    console.log(`API is running in port ${PORT}`)
})

mongoose
.connect('mongodb+srv://chandruinfo455:chandru455@cluster0.wxpxjws.mongodb.net/?retryWrites=true&w=majority')
.then(()=>{
    console.log("connected to database")
}).catch((error)=>{
    console.log(error)
})
