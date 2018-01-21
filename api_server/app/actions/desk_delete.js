var User = require('../models/user');
var Desk = require('../models/desk');

function desk_delete(user_id, desk_id) {
    var res_json = {
        err: false,
        err_msg: "",
        status: 200,
        result: ""
    };
    var that = this;
    this.user_id = user_id;
    this.desk_id = desk_id;
    this.desk_delete =function (user_id, desk_id, callback) {

        User.findById(user_id, function (err, user) {
            if(err){
                res_json.err = true;
                res_json.err_msg = err;
                res_json.status = 500;
                callback();
                return false;
            }
            var desks = user.desks;
            var rm_index = desks.indexOf(desk_id);
            if(rm_index!==-1){
                console.log(desks, desk_id, rm_index);
                desks.splice(rm_index,rm_index);
                var promise = Desk.findById(desk_id)
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
                        res_json.status = 500;
                        callback();
                    }
                );
            }else {
                res_json.err = true;
                res_json.err_msg = "Could not found requested desk in user's desk list.";
                res_json.status = 500;
                callback();
                return false;
            }
            user.desks = desks;
            user.save();
            callback();
            return true;
        });

    };
    this.do_exec = function(callback){
        that.desk_delete(that.user_id, that.desk_id, callback);
    };
    this.getResult = function () {
        return res_json;
    };
}

module.exports = desk_delete;