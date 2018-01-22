var Comment = require('../models/comment');

function comment_available(c_id, available) {
    var res_json = {
        err: false,
        err_msg: "",
        status: 200,
        result: []
    };
    var that = this;
    this.available_change = function (comment_id, available, callback) {
        Comment.findById(comment_id, function (err, res) {
            if(!res){
                res_json.err = true;
                res_json.err_msg = "Could not find comment required by client.";
                res_json.status = 500;
                callback();
                return false;
            }
            switch (available){
                case true:
                    res.available = true;
                    break;
                case false:
                    res.available = false;
                    break;
                default:
                    res.available = !res.available;
                    break;
            }
            var promise = res.save();
            promise.then(
                function (result) {
                    res_json.result = {
                        info: "success",
                        status: result.available
                    };
                    callback();
                    return true;
                },
                function (err) {
                    res_json.err = true;
                    res_json.err_msg = err;
                    res_json.status = 500;
                    callback();
                    return false;
                }
            )
        })
    };
    this.do_exec = function (callback) {
        that.available_change(c_id, available, callback);
    };
    this.getResult = function () {
        return res_json;
    }
}

module.exports = comment_available;