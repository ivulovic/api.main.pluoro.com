const DirectoryModel = require("../../models/notes/directory.model");
const NoteModel = require("../../models/notes/note.model");
const { Unauthorized } = require("../../helpers/response.helper");
module.exports = {
  create: async (req, res) => {
    const content = req.value.body;
    const directory = await DirectoryModel.findById(content.directory);
    if (!directory) {
      return res.status(403).send(Unauthorized);
    }
    if (directory && directory.createdBy != req.decoded.user) {
      return res.status(403).send(Unauthorized);
    }
    content.createdAt = Date.now();
    content.createdBy = req.decoded.user;
    let objToSave = new NoteModel(content);
    await objToSave.save();
    objToSave.directory = directory;
    res.status(200).send(objToSave);
  },
  update: async (req, res) => {
    const { id } = req.value.params;
    const content = req.value.body;
    const directory = await DirectoryModel.findById(content.directory);
    if (!directory) {
      return res.status(403).send(Unauthorized);
    }
    // only creator can modify
    if (directory && directory.createdBy != req.decoded.user) {
      return res.status(403).send(Unauthorized);
    }
    let objToSave = await NoteModel.findByIdAndUpdate(id, content);
    objToSave.directory = directory;
    if (content.title) objToSave.title = content.title;
    if (content.description) objToSave.description = content.description;
    res.status(200).send(objToSave);
  },
  remove: async (req, res) => {
    const { id } = req.value.params;
    // add only creator can delete
    let objToSave = await NoteModel.findByIdAndRemove(id);
    objToSave.directory = await DirectoryModel.findById(objToSave.directory);
    res.status(200).send(objToSave);
  },
  list: async (req, res) => {
    const objs = await NoteModel.find({ createdBy: req.decoded.user, directory: req.value.params.id }).sort("-createdAt");//.populate("directory");
    res.status(200).send(objs);
  },
  info: async (req, res) => {
    const objs = await NoteModel.findOne({ createdBy: req.decoded.user, _id: req.value.params.id });//.populate("directory");
    res.status(200).send(objs);
  },
};
