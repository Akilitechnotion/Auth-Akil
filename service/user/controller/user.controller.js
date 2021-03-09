const CONSTANTS = require("../../../config/constant");
const userModel = require("../model/user.model");
const util = require("../../../utils/response");
const message = require("../../../utils/messages.json");
const ValidateFields = require("./user.validation");
const sanitizer = require("sanitizer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("../../../utils/nodemailer");

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

  async logout(request, response) {
    let id = sanitizer.sanitize(request.params.id);
    console.log(id);

    if (id != "" && id != null && typeof id != undefined) {
      try {
        const result = await userModel.findUserById(id);
        if (result && result.length > 0) {
          let id = result[0]["id"];
          let token = "1";
          const logout = await userModel.updateToken(id, token);
          console.log(logout);
          if (logout && logout != null) {
            if (logout.nModified == 1) {
              response.send(util.success({ updated: true }, message.logout_message_success));
            } else {
              response.send(util.success({ updated: false }, message.allready_logged_out));
            }
          } else {
            response.send(util.error({}, message.common_messages_record_not_available));
          }
        } else {
          response.send(util.error({}, message.common_messages_record_not_available));
        }
      } catch (error) {
        response.status(400).send(util.error(error, message.common_messages_error));
      }
    } else {
      response.send(util.error({}, message.common_messages_record_not_available));
    }
  }

  async forgotPasswordByEmail(request, response) {
    var email = sanitizer.sanitize(request.params.email);
    try {
      const result = await userModel.findUserByEmail(email);
      if (result && result.length > 0) {
        const payload = { id: result[0]._id };
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(payload, secret);

        const tokenAdd = await userModel.resetTokenSave(result[0]["email"], token);
        if (tokenAdd.nModified == 1) {
          var mailResponse = await mailer.send(result[0]["email"], "Forget Password", true, token);
          if (mailResponse && mailResponse != null && mailResponse != undefined) {
            response.send(util.success(mailResponse, message.mail_sent));
          } else {
            response.send(util.error({}, message.mail_not_sent));
          }
        } else {
          response.send(util.error({}, message.mail_not_sent));
        }
      } else {
        response.send(util.error({}, message.common_messages_record_not_available));
      }
    } catch (error) {
      response.status(400).send(util.error(error, message.common_messages_error));
    }
  }

  async forgotPassword(request, response) {
    var token = request.params.token;
    var data = {
      password: sanitizer.sanitize(request.body.password),
      cpassword: sanitizer.sanitize(request.body.cpassword),
    };

    const resp = ValidateFields.validateForgotPassword(data);

    if (resp.error) {
      response.send(resp.error.details[0].message);
    } else {
      try {
        if (data.password === data.cpassword) {
          const result = await userModel.findUserByToken(token);
          if (result && result.length > 0) {
            const change_pass = await userModel.userUpdatePassword(result[0]["_id"], bcrypt.hashSync(data.password, 6));
            if (change_pass && change_pass != null) {
              if (change_pass.nModified == 1) {
                var updateResetToken = await userModel.resetTokenSave(result[0]["email"], undefined);
                if (updateResetToken && updateResetToken.nModified == 1) {
                  response.send(util.success({ updated: true }, message.common_messages_record_updated));
                } else {
                  response.send(util.error({}, message.common_messages_record_not_updated));
                }
              } else {
                response.send(util.success({ updated: false }, message.common_messages_record_not_updated));
              }
            } else {
              response.send(util.error({}, message.common_messages_error));
            }
          } else {
            response.send(util.error({}, message.common_messages_error));
          }
        } else {
          response.send(util.error("", message.common_message_password_not_match));
        }
      } catch (error) {
        response.status(400).send(util.error(error, "server error"));
      }
    }
  }
}

module.exports = new EventHandler();
