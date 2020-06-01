const Joi = require("@hapi/joi");

const registrationValidation = (data) => {
  const Schema = Joi.object({
    email: Joi.string().min(3).max(50).required().email(),
    password: Joi.string().min(5).required(),
  });

  return Schema.validate(data);
};

module.exports = registrationValidation;
