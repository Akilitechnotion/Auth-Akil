"use strict";
const EventSchema = require("./user.schema");

class EventModel {
  constructor() {
    this.DB = require("../../../config/dbm");
    this.projectedKeys = {
      crtd_dt: true,
    };
  }

  /*
   * Name of the Method : eventByOrgId
   * Description : Fetchs the list of Orders
   * Parameter : None
   * Return : Promise<OrderDetails>
   */

  eventByOrgId() {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await EventSchema.aggregate([
          {
            $match: {
              is_deleted: false,
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              org_id: 1,
              desc: 1,
              start_date: 1,
              end_date: 1,
              filler_media: 1,
              banner: 1,
              mobile: 1,
              place: 1,
              is_deleted: 1,
              crtd_dt: 1,
              crtd_by: 1,
              uptd_dt: 1,
              uptd_by: 1,
            },
          },
        ]);
        resolve(result);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
}

module.exports = new EventModel();
