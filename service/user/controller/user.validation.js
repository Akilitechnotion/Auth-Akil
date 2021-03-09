const Joi = require("joi");
class ValidateFields {
  validateAddUser(req) {
    const JoiSchema = Joi.object({
      first_name: Joi.string().min(2).max(30).required(),
      last_name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(3).max(15).required(),
      cpassword: Joi.string().required(),
      mobile: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required(),
      created_date: Joi.optional(),
      gender: Joi.optional(),
    });
    return JoiSchema.validate(req);
  }
}

module.exports = new ValidateFields();
