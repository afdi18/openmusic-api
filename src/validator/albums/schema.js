const Joi = require('joi');

const tahun = new Date().getFullYear();

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().min(1900).max(tahun).required(),
});

module.exports = { AlbumPayloadSchema };
