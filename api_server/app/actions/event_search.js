var EventCollection = require('../models/events_collection');
var User = require('../models/user');
var Desk = require('../models/desk');
var Comment = require('../models/comment');

function event_search(keyword, filter) {
    var res_json = {
        err: false,
        err_msg: "",
        status: 200,
        result: []
    };
    var that = this;
    this.keyword = keyword;
    this.filter = filter;
    this.event_search = function (keyword, filter, callback) {
        var reg = new RegExp(keyword, 'i');
        var promise = EventCollection
            .find({
                $or:[
                    {_id: {$regex: reg}},
                    {name: {$regex: reg}}
                ]
            }).exec();

        promise.then(
            function (doc) {
                doc.forEach(function (value ,index) {
                    var holder_id = "";
                    var holder_name = "";
                    var type = "";
                    if(value.private){
                        if(index===doc.length-1){
                            rc();
                            return;
                        }else{
                            return;
                        }
                    }
                    if(!value.professor_id){
                        holder_id = value.creator_id;
                        type = "公开事件";
                    }else{
                        holder_id = value.professor_id;
                        type = "课程";
                    }
                    User.findById(holder_id, function (err, res) {
                        holder_name = res.name;
                        var event_obj = {
                            _id: value._id,
                            name: value.name,
                            // holder_id: holder_id,
                            holder_name: holder_name,
                            type: type,
                            semester: value.semester
                        };
                        res_json.result.push(event_obj);
                        if(index===doc.length-1){
                            rc();
                        }
                    });
                });

            },
            function (err) {
                console.log(err);
                res_json.err = true;
                res_json.err_msg = err;
                callback();
            }
        );

        function rc() {
            callback();
        }

    };
    this.do_exec = function (callback) {
        that.event_search(that.keyword, that.filter, callback);
    };
    this.getResult = function () {
        return res_json;
    }
}

module.exports = event_search;