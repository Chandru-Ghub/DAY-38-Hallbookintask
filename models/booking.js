const mongo = require("mongoose");

const bookingSchema = mongo.Schema({
  BookingId: {
    type: String,
    required: [true, "enter the booking ID"],
  },
  customerName: {
    type: String,
    required: [true, "enter the name"],
  },
  Date: {
    type: String,
    required: [true, "enter the date"],
  },
  StartTime: {
    type: String,
    required: [true, "enter the start time"],
  },
  EndTime: {
    type: String,
    required: [true, "enter the start time"],
  },
  Room_ID: {
    type: String,
    required: [true, "enter the room ID"],
  },
},
{
  timestamp :true
}
);

const Booking = mongo.model("Booking", bookingSchema);

module.exports = Booking;