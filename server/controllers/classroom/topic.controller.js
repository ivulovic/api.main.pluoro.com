const SubjectModel = require("../../models/classroom/subject.model");
const TopicModel = require("../../models/classroom/topic.model");
const { Unauthorized } = require("../../helpers/response.helper");
module.exports = {
  create: async (req, res) => {
    const content = req.value.body;
    const subject = await SubjectModel.findById(content.subject);
    if (!subject) {
      return res.status(403).send(Unauthorized);
    }
    if (subject && subject.createdBy != req.decoded.user) {
      return res.status(403).send(Unauthorized);
    }
    content.createdAt = Date.now();
    content.createdBy = req.decoded.user;
    let objToSave = new TopicModel(content);
    await objToSave.save();
    objToSave.subject = subject;
    res.status(200).send(objToSave);
  },
  update: async (req, res) => {
    const { id } = req.value.params;
    const content = req.value.body;
    const subject = await SubjectModel.findById(content.subject);
    if (!subject) {
      return res.status(403).send(Unauthorized);
    }
    if (subject && subject.createdBy != req.decoded.user) {
      return res.status(403).send(Unauthorized);
    }
    let objToSave = await TopicModel.findByIdAndUpdate(id, content);
    objToSave.subject = subject;
    if (content.name) objToSave.name = content.name;
    if (content.link) objToSave.link = content.link;
    res.status(200).send(objToSave);
  },
  remove: async (req, res) => {
    const { id } = req.value.params;
    const topic = await TopicModel.findById(id);
    if(topic.createdBy.toString() !== req.decoded.user){
      return res.status(403).send(Unauthorized);
    }
    let objToSave = await TopicModel.findByIdAndRemove(id);
    objToSave.subject = await SubjectModel.findById(objToSave.subject);
    res.status(200).send(objToSave);
  },
  list: async (req, res) => {
    const objs = await TopicModel.find({ createdBy: req.decoded.user, subject: req.value.params.id }).sort("-createdAt");
    res.status(200).send(objs);
  },
  info: async (req, res) => {
    const objs = await TopicModel.findOne({ createdBy: req.decoded.user, _id: req.value.params.id });
    res.status(200).send(objs);
  },
};
