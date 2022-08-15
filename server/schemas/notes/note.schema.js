const Joi = require("joi");

module.exports = {
  create: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string(),
    directory: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  }),
  update: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string(),
    directory: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  })
}