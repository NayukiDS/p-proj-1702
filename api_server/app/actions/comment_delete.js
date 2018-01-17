var Comment = require('../models/comment');

function comment_delete(c_id) {
    var res_json = {
        err: false,
        err_msg: "",
        result: []
    };
    var that = this;
    this.RmComment = function (comment_id, callback) {

        var promise = Comment.find({
            '_id': comment_id.toString()
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
                callback();
            }
        )

    };
    this.reformat = function () {

    };
    this.getResult = function () {
        return res_json;
    };
    this.do_exec = function (callback) {
        var promise = Comment.find({
            '_id': c_id
        });
        promise.then(
            function (result) {
                that.RmComment(c_id, callback);
            },
            function (err) {
                res_json.err = true;
                res_json.err_msg = err;
                callback();
            }
        )

    }
}

module.exports = comment_delete;