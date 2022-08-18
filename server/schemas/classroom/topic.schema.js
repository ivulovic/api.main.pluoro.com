const Joi = require("joi");

module.exports = {
  create: Joi.object().keys({
    name: Joi.string().required(),
    link: Joi.string(),
    subject: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  }),
  update: Joi.object().keys({
    name: Joi.string().required(),
    link: Joi.string(),
    subject: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  })
}