var User = require('../models/user');
var Desk = require('../models/desk');

function desk_new(user_id, pre_desk, name, bind_class) {
    var res_json = {
        err: false,
        err_msg: "",
        status: 200,
        result: ""
    };
    var that = this;
    this.user_id = user_id;
    this.pre_desk = pre_desk;
    this.name = name;
    this.bind_class = bind_class;
    this.desk_create =function (user_id, pre_desk, name, bind_class, callback) {
        var desk = new Desk;
        if(!pre_desk){
            pre_desk = "";
        }else{
            var promise = Desk.findById(pre_desk).exec();
            promise.then(
                function (result) {
                    if(Object.keys(result).length === 0){
                        res_json.err = true;
                        res_json.err_msg = "Could not find pre_desk required by client.";
                        res_json.status = 500;
                        callback();
                        return false;
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
        }
        desk.pre_desk = pre_desk;
        if(!name) name = "未命名桌面";
        desk.name = name;
        if(!bind_class) bind_class = "";
        desk.bind_class = bind_class;
        desk.courses = [];
        var promise_save = desk.save();
        promise_save.then(
            function (result) {
                console.log(result);
                res_json.result = result;
                User.findById(user_id, function (err, user) {
                    if(err){
                        res_json.err = true;
                        res_json.err_msg = err;
                        res_json.status = 500;
                        callback();
                        return false;
                    }
                    var desks = user.desks;
                    desks.push(res_json.result._id);
                    user.desks = desks;
                    user.save();
                    callback();
                    return true;
                });
            },
            function (err) {
                res_json.err = true;
                res_json.err_msg = err;
                res_json.status = 500;
                callback();
                return false;
            }
        );
    };
    this.do_exec = function(callback){
        that.desk_create(that.user_id, that.pre_desk, that.name, that.bind_class, callback);
    };
    this.getResult = function () {
        return res_json;
    };
}

module.exports = desk_new;