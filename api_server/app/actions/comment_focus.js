var Comment = require('../models/comment');

function comment_focus(c_id, focus) {
    var res_json = {
        err: false,
        err_msg: "",
        status: 200,
        result: {}
    };
    var that = this;
    this.focus_change = function (comment_id, focus, callback) {
        Comment.findById(comment_id, function (err, res) {
            if(!res){
                res_json.err = true;
                res_json.err_msg = "Could not find comment required by client.";
                res_json.status = 500;
                callback();
                return false;
            }
            switch (focus){
                case true:
                    res.focus = true;
                    break;
                case false:
                    res.focus = false;
                    break;
                default:
                    res.focus = !res.focus;
                    break;
            }
            var promise = res.save();
            promise.then(
                function (result) {
                    res_json.result = {
                        info: "success",
                        status: result.focus
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
        that.focus_change(c_id, focus, callback);
    };
    this.getResult = function () {
        return res_json;
    }
}

module.exports = comment_focus;