var Util = function () {};

Util.prototype.success = function (payload, message) {

    //log.info("res: " + JSON.stringify( payload))
    if (payload && payload.length > 0 ) 
    { 
        return {success: true, message: message, result: payload}
    }
    else
    {
        return {success: false, message: "Records are not available", result: {}}
    }
   

}
Util.prototype.error = function (payload, message) {
    //log.error("err: " + payload)
    return {success: false, message: message, result: {}}

}
module.exports =new Util();
