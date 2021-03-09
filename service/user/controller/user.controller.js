const CONSTANTS = require("../../../config/constant");
const userModel = require("../model/user.model");
const util = require("../../../utils/response");
const message = require("../../../utils/messages.json");
const ValidateFields = require("./user.validation");
const sanitizer = require("sanitizer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class EventHandler {
  async register(request, response) {
    var req_body = {
      first_name: sanitizer.sanitize(request.body.first_name),
      last_name: sanitizer.sanitize(request.body.last_name),
      email: sanitizer.sanitize(request.body.email),
      password: sanitizer.sanitize(request.body.password),
      cpassword: sanitizer.sanitize(request.body.cpassword),
      mobile: sanitizer.sanitize(request.body.mobile),
      gender: sanitizer.sanitize(request.body.gender),
    };

    const resp = ValidateFields.validateAddUser(req_body);
    if (resp.error) {
      response.send({ error: resp.error.details[0].message });
    } else {
      if (sanitizer.sanitize(request.body.password) != sanitizer.sanitize(request.body.cpassword)) {
        response.send(util.error({}, message.password_doesnt_match));
      } else {
        try {
          var result = await userModel.findUserByEmail(req_body.email);
          if (result && result.length > 0) {
            response.send(util.error({}, message.email_already_exist));
          } else {
            var resultMobile = await userModel.findUserByMobile(req_body.mobile);
            if (resultMobile && resultMobile.length > 0) {
              response.send(util.error({}, message.mobile_already_exist));
            } else {
              const result = await userModel.userRegister(req_body);
              response.send(util.success(result, message.common_messages_record_added));
            }
          }
        } catch (error) {
          response.status(400).send(util.error(error, message.common_message_error_message));
        }
      }
    }
  }

  async login(request, response) {
    var req_data = {
      mobile: sanitizer.sanitize(request.body.mobile),
      password: sanitizer.sanitize(request.body.password),
    };

    const resp = ValidateFields.validateLoginUser(req_data);

    if (resp.error) {
      response.send(resp.error.details[0].message);
    } else {
      if (req_data.mobile != null && req_data.password != null) {
        const result = await userModel.findUserByMobile(req_data.mobile);
        if (result && result.length > 0 && result != undefined) {
          bcrypt.compare(req_data.password, result[0].password, async function (err, pres) {
            if (pres == true) {
              const payload = {
                id: result[0]["_id"],
                mobile: result[0]["mobile"],
              };
              const secret = process.env.JWT_SECRET;
              const token = jwt.sign(payload, secret);
              await userModel.updateToken(result[0]["_id"], token);
              var user_detail = await userModel.findUserById(result[0]["_id"]);

              response.send(util.success(user_detail, message.common_message_record_found));
            } else {
              response.status(400).send(util.error({}, message.in_correct_email_psw_error));
            }
          });
        } else {
          response.send(util.error({}, message.common_messages_record_not_available));
        }
      } else {
        response.send(util.error({}, message.required_parameters_null_or_missing));
      }
    }
  }
}

module.exports = new EventHandler();
