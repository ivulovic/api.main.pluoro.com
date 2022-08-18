const SubjectModel = require("../../models/classroom/subject.model");
const TopicModel = require("../../models/classroom/topic.model");
const AccountModel = require("../../models/account.model");

module.exports = {
  findOne: async(req, res) => {
    const id = req.value.params.id;
    const subject = await SubjectModel.findOne({ _id: id });
    const topics = await TopicModel.find({ createdBy: req.decoded.user, subject: id }).sort("-createdAt");
    res.status(200).send({
      subject,
      topics
    });
  },
  create: async (req, res) => {
    const content = req.value.body;
    content.createdAt = Date.now();
    content.createdBy = req.decoded.user;
    const objToSave = new SubjectModel(content);
    await objToSave.save();
    res.status(200).send({
      ...objToSave,
      topics: [],
    });
  },
  list: async (req, res) => {
    const subjects = await SubjectModel.find({ createdBy: req.decoded.user }).sort("-createdAt");
    const subjectWithTopics = [];
    for(let i = 0; i < subjects.length; i++ ){
      const current = subjects[i];
      subjectWithTopics.push({
        _id: current._id,
        name: current.name,
        topics: await TopicModel.find({ createdBy: req.decoded.user, subject: current._id },  { description: 0 }).sort("-createdAt")
      })
    }
    res.status(200).send(subjectWithTopics);
  },
  listForUser: async (req, res) => {
    const { id } = req.value.params;
    const user = await AccountModel.findOne({ email: id ? id.toLowerCase() : "" });
    if (!user) {
      return res.status(404).json({ status: 404, message: "User with such email does not exist." });
    }
    const subjects = await SubjectModel.find({ createdBy: user._id }).sort("-createdAt");
    const subjectWithTopics = [];
    for(let i = 0; i < subjects.length; i++ ){
      const current = subjects[i];
      subjectWithTopics.push({
        _id: current._id,
        name: current.name,
        topics: await TopicModel.find({ createdBy: user._id, subject: current._id },  { description: 0 }).sort("-createdAt")
      })
    }
    res.status(200).send(subjectWithTopics);
  },
  remove: async (req, res) => {
    const { id } = req.value.params;
    const subject = await SubjectModel.findById(id);
    if(subject.createdBy.toString() !== req.decoded.user){
      return res.status(403).send(Unauthorized);
    }
    const topicsToRemove = await TopicModel.find({ subject: id });
    if (topicsToRemove) {
      for (let i = 0; i < topicsToRemove.length; i++) {
        await TopicModel.findByIdAndRemove(topicsToRemove[i]._id);
      }
    }
    let objToSave = await SubjectModel.findByIdAndRemove(id);
    res.status(200).send(objToSave);
  },
  update: async (req, res) => {
    const { id } = req.value.params;
    const content = req.value.body;
    const objToSave = await SubjectModel.findByIdAndUpdate(id, content);
    if (content.name) objToSave.name = content.name;
    res.status(200).send(objToSave);
  }
};
