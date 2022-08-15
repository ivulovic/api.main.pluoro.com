const { Schema, model } = require("mongoose");

const DirectorySchema = new Schema({
  name: String,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "account"
  },
  createdAt: Number
});

module.exports = model("directory", DirectorySchema);
