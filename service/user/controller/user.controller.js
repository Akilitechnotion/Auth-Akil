const CONSTANTS = require("../../../config/constant");
const userModel = require("../model/user.model");
const util = require("../../../utils/response");
const message = require("../../../utils/messages.json");
const ValidateFields = require("./user.validation");
const sanitizer = require("sanitizer");

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
          }

          var resultMobile = await userModel.findUserByMobile(req_body.mobile);
          if (resultMobile && resultMobile.length > 0) {
            response.send(util.error({}, message.mobile_already_exist));
          } else {
            try {
              if (sanitizer.sanitize(request.body.image) && sanitizer.sanitize(request.body.image) != null) {
                let timestamp = new Date().valueOf();
                var fileName = timestamp + ".jpg";
                var uploadPath = "../uploads/userimages/";
                var dbFilename = await localupload.uploadFile(sanitizer.sanitize(request.body.image), fileName, uploadPath);
                req_body["profile"] = dbFilename;
              }

              const result = await userModel.userRegister(req_body);

              var req = {
                user_id: result._id,
                team_id: result.team_id,
                created_date: new Date(),
              };
              if (result.user_type === 1) {
                const resultTeamAdded = teamPlayerModel.playerRegister(req);
              }
              if (result && result != null) {
                const userDetails = await userModel.findUserById(result._id);
                response.send(util.success(userDetails, message.common_messages_record_added));
              } else {
                response.send(util.error(result, message.something_went_wrong));
              }
            } catch (error) {
              response.status(400).send(util.error(error, message.something_went_wrong));
            }
          }
        } catch (error) {
          response.status(400).send(util.error(error, message.common_message_error_message));
        }
      }
    }
  }
}

module.exports = new EventHandler();
