const DirectoryModel = require("../../models/notes/directory.model");
const NoteModel = require("../../models/notes/note.model");

module.exports = {
  findOne: async(req, res) => {
    const directoryId = req.value.params.id;
    const directory = await DirectoryModel.findOne({ _id: directoryId });
    const notes = await NoteModel.find({ createdBy: req.decoded.user, directory: directoryId }).sort("-createdAt");//.populate("directory");
    res.status(200).send({
      directory,
      notes
    });
  },
  create: async (req, res) => {
    const content = req.value.body;
    content.createdAt = Date.now();
    content.createdBy = req.decoded.user;
    const objToSave = new DirectoryModel(content);
    await objToSave.save();
    res.status(200).send(objToSave);
  },
  list: async (req, res) => {
    const directories = await DirectoryModel.find({ createdBy: req.decoded.user }).sort("-createdAt");
    const directoriesWithNotes = [];
    for(let i = 0; i < directories.length; i++ ){
      const current = directories[i];
      directoriesWithNotes.push({
        _id: current._id,
        name: current.name,
        notes: await NoteModel.find({ createdBy: req.decoded.user, directory: current._id },  { description: 0 }).sort("-createdAt")
      })
    }
    res.status(200).send(directoriesWithNotes);
  },
  remove: async (req, res) => {
    const { id } = req.value.params;
    const directory = await DirectoryModel.findById(id);
    if(directory.createdBy.toString() !== req.decoded.user){
      return res.status(403).send(Unauthorized);
    }
    const notesToRemove = await NoteModel.find({ directory: id });
    if (notesToRemove) {
      for (let i = 0; i < notesToRemove.length; i++) {
        await NoteModel.findByIdAndRemove(notesToRemove[i]._id);
      }
    }
    let objToSave = await DirectoryModel.findByIdAndRemove(id);
    res.status(200).send(objToSave);
  },
  update: async (req, res) => {
    const { id } = req.value.params;
    const content = req.value.body;
    const objToSave = await DirectoryModel.findByIdAndUpdate(id, content);
    if (content.name) objToSave.name = content.name;
    res.status(200).send(objToSave);
  }
};
