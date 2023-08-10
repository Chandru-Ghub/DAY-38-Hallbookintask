const mongo = require("mongoose");

const RoomSchema = mongo.Schema({
  Room_ID: {
    type: String,
    required: [true, "enter the room id"],
  },
  No_seats: {
    type: String,
    required: [true, "enter the number of seats"],
  },
  amenities: {
    type: String,
    required: [true, "enter the amenities"],
  },
  price: {
    type: String,
    required: [true, "enter the price"],
  },
});

const Rooms = mongo.model("Rooms", RoomSchema);

module.exports = Rooms;