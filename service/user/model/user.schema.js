const mongoose = require('mongoose');
const CC = require('../../../config/constant_collection');
/**
 * Event Schema
 */
const EventSchema = new mongoose.Schema({
    org_id: {
        type: mongoose.Schema.Types.ObjectId,
        //ref: "o001_organization"
    },
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    banner: [],
    filler_media: {
        id: {
            type: mongoose.Schema.Types.ObjectId
        },
        type: {
            type: String
        },
        path: {
            type: String
        },
        is_deleted: {
            type: Boolean,
            default: false
        },
    },
    event_type_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: CC.A004_REFERENCE_DATA
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    crtd_by:{
        type: mongoose.Schema.Types.ObjectId,
        ref: CC.U001_USERS
    },
    uptd_by:{
        type: mongoose.Schema.Types.ObjectId,
        ref: CC.U001_USERS
    },
    crtd_dt :{ 
        type: Number, 
        default: (new Date()).getTime() 
    },
    uptd_dt :{
        type: Number, 
        default: (new Date()).getTime() 
    }
});
module.exports = mongoose.model(CC.O002A_EVENT, EventSchema);
