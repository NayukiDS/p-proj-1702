var Comment = require('../models/comment');

function comment_create(pre_comment, user_id, event_id, content) {
    var res_json = {
        err: false,
        err_msg: "",
        result: []
    };
    var that = this;
    this.newComment = function (n_pre_comment, n_user_id, n_event_id, n_content, callback) {
        var comment = new Comment;
        comment.pre_comment = n_pre_comment;
        comment.user_id = n_user_id;
        comment.event_id = n_event_id;
        comment.content = n_content;

        var promise = comment.save();

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
        that.newComment(pre_comment, user_id, event_id, content, callback)
    }
}

module.exports = comment_create;