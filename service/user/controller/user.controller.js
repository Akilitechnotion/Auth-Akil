const CONSTANTS = require("../../../config/constant");
const eventModel = require("../model/user.model");
const util = require("../../../utils/response");
const message = require("../../../utils/messages.json");
const upload = require("../../../utils/upload");

class EventHandler {
  async register(request, response) {
    try {
      const events = await eventModel.eventByOrgId();
      response.send(util.success(events, message.common_messages_record_available));
    } catch (error) {
      response.send(util.error(error, message.common_messages_error));
    }
  }

  async sampleEvent(request, response) {
    console.log("sample event");
    /* try {  
      console.log("sample event");
    } catch (error) {
      response.send(
        util.error(error, message.common_messages_error)
      );
    } */
  }

  async upload(request, response) {
    try {
      const events = await upload.uploadFile("sample.png", "sample.png");
      response.send(util.success(events, message.common_messages_record_available));
    } catch (error) {
      response.send(util.error(error, message.common_messages_error));
    }
  }
}

module.exports = new EventHandler();
