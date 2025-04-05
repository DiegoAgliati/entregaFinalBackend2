import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  code: { type: String, unique: true, default: () => Math.random().toString(36).substring(2, 15) },
  purchase_datetime: { type: Date, default: Date.now },
  amount: Number,
  purchaser: String
});

export const Ticket = mongoose.model("Ticket", ticketSchema);