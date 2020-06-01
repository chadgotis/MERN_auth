const Joi = require("@hapi/joi");

const loginValidation = (data) => {
  const Schema = Joi.object({
    email: Joi.string().email().min(5).max(30).required(),
    password: Joi.string().required().min(5).max(30),
  });

  return Schema.validate(data);
};
module.exports = loginValidation;
