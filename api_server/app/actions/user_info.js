var User = require('../models/user');

var User = require('../models/user');

function user_info(u_id, owner) {
    var res_json = {
        err: false,
        err_msg: "",
        status: 200,
        result: []
    };
    var that = this;
    this.getUser = function (user_id, owner, callback) {

        var promise = User.findById(user_id).exec();

        promise.then(
            function (result) {
                if(Object.keys(result).length === 0){
                    res_json.err = true;
                    res_json.err_msg = "Can not find user required by client in DB.";
                    res_json.status = 500;
                    callback();
                    return false;
                }else{
                    var user_data ={};
                    user_data._id = result._id;
                    user_data.wechat_avatar = result.wechat_avatar;
                    user_data.name = result.name;
                    user_data.authentic = result.authentic;
                    user_data.info = result.info;
                    if(owner){
                        user_data.bind_id = result.bind_id;
                        user_data.admin = result.admin;
                        user_data.desks = result.desks;
                    }
                    res_json.result = user_data;
                    callback();
                    return true;
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
    };
    this.getResult = function () {
        return res_json;
    };
    this.do_exec = function (callback) {
        that.getUser(u_id, owner, callback);
    }
}

module.exports = user_info;