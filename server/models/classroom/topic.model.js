const { Schema, model } = require("mongoose");

const NotesSchema = new Schema({
  name: String,
  link: String,
  subject: {
    type: Schema.Types.ObjectId,
    ref: "subject"
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "account"
  },
  createdAt: Number
});

module.exports = model("classroomTopic", NotesSchema, "classroomTopics");
