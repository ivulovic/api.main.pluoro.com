const { Schema, model } = require("mongoose");

const NotesSchema = new Schema({
  title: String,
  description: String,
  directory: {
    type: Schema.Types.ObjectId,
    ref: "directory"
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "account"
  },
  createdAt: Number
});

module.exports = model("note", NotesSchema);
