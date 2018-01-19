var Comment = require('../models/comment');
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
            select: 'name bind_id wechat_avatar'
        })
        .exec();

        promise.then(
            function (result) {
                var res_array = [];
                result.forEach(function(doc){
                    if(doc.available){
                        console.log(doc);
                        var res_filter = {
                            _id: doc._id,
                            pre_comment: doc.pre_comment,
                            user_id: doc.user_detail[0]._id,
                            user_bind: doc.user_detail[0].bind_id,
                            user_name: doc.user_detail[0].name,
                            user_avatar: doc.user_detail[0].wechat_avatar,
                            add_ts: doc.add_ts,
                            focus: doc.focus,
                            content: doc.content
                        };
                        res_array.push(res_filter)
                    }
                });
                res_json.result = res_array;
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

function comment_obj(_id, pre_comment, user_id, user_name, user_avatar, add_ts, focus, content){
    this._id = _id;
    this.pre_comment = pre_comment;
    this.user_id = user_id;
    this.user_name = user_name;
    this.user_avatar = user_avatar;
    this.add_ts = add_ts;
    this.focus = focus;
    this.content = content;
}

module.exports = comment_list_get_by_event;