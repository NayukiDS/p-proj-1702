var Comment = require('../models/Comment');
var json_add = require('../module/json_add');

function comment_list_get_by_event(e_id) {
    var res_json = {
        err: false,
        err_msg: "",
        result: []
    };
    var that = this;
    this.getComment = function (event_id, callback) {

        var promise = Comment.find({
            'event_id': event_id.toString()
        })
        .sort('add_ts')
        // .populate('user_c')
        .populate({
            path: 'user_detail',
            select: 'name bind_id'
        })
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
        // var promise = Comment
        that.getComment(e_id, callback)
    }
}

module.exports = comment_list_get_by_event;