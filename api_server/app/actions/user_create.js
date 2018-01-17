var User = require('../models/user');

function user_create(open_id, avatar_url, name, bind_id) {
    var res_json = {
        err: false,
        err_msg: "",
        status: 200,
        result: []
    };
    var that = this;
    this.newUser = function (wechat_id, wechat_avatar, wechat_name, bind_id, callback) {
        if(!bind_id){

        }
        var user = new User;

        var promise = User
        .find({
            wechat_id: wechat_id
        }).exec();

        promise.then(
            promise.then(
                function (result) {
                    if(Object.keys(result).length !== 0){
                        res_json.err = true;
                        res_json.err_msg = "This wechat id already have an account in database.";
                        res_json.status = 403;
                        callback();
                        return false;
                    }else{
                        user.wechat_id = wechat_id;
                        user.wechat_avatar = wechat_avatar;
                        user.name = wechat_name;
                        user.bind_id = bind_id;

                        promise = user.save();

                        promise.then(
                            function (result) {
                                res_json.result = result;
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
                    }
                },
                function (err) {
                    res_json.err = true;
                    res_json.err_msg = err;
                    res_json.status = 500;
                    callback();
                    return false;
                }
            )
        );
    };
    this.getResult = function () {
        return res_json;
    };
    this.do_exec = function (callback) {
        that.newUser(open_id, avatar_url, name ,bind_id, callback);
    }
}

module.exports = user_create;