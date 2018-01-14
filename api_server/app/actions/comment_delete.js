var Comment = require('../models/Comment');

function comment_delete(e_id) {
    var res_json = {
        err: false,
        err_msg: "",
        result: []
    };
    var that = this;
    this.RmComment = function (event_id, callback) {

        var promise = Comment.find({
            'event_id': event_id.toString()
        })
            .remove()
            .exec();

        promise.then(
            function (result) {
                res_json.result = result;
                callback();
            },
            function (err) {
                res_json.err = true;
                res_json.err_msg = err;
            }
        )

    };
    this.reformat = function () {

    };
    this.getResult = function () {
        return res_json;
    };
    this.do_exec = function (callback) {
        // var promise = Comment
        that.RmComment(e_id, callback)
    }
}

module.exports = comment_delete;