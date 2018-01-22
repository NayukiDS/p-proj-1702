var Desk = require('../models/desk');
// var mongoose = require('mongoose');

function event_bind_desk(d_id, e_id){
    var res_json = {
        err: false,
        err_msg: "",
        status: 200,
        result: ""
    };
    var that = this;
    this.d_id = d_id;
    this.e_id = e_id;
    this.a_bind = function (callback) {
        Desk.findById(that.d_id, function (err, desk) {
            if(desk){
                var index = desk.courses.indexOf(that.e_id);
                if(index!==-1){
                    var array = desk.courses;
                    array.splice(index,index);
                    desk.courses = array;
                    desk.save();
                    callback();
                }else{
                    callback();
                }
            }else{
                console.log("no desk found");
                callback();
            }
        });
    };
    this.e_bind = function (callback) {
        Desk.findById(that.d_id, function (err, desk) {
            if(desk){
                var index = desk.courses.indexOf(that.e_id);
                if(index===-1){
                    var array = desk.courses;
                    array.push(e_id);
                    desk.courses = array;
                    desk.save();
                    callback();
                }else{
                    callback();
                }
            }else{
                console.log("no desk found");
                callback();
            }
        })
    };
    this.getResult = function () {
        return res_json;
    }
}

module.exports = event_bind_desk;