var EventCollection = require('../models/events_collection');
var User = require('../models/user');
var Desk = require('../models/desk');
var Comment = require('../models/comment');

function event_search(keyword, type, semester) {
    var res_json = {
        err: false,
        err_msg: "",
        status: 200,
        result: []
    };
    var that = this;
    this.keyword = keyword;
    this.type = type;
    this.semester = semester;
    this.event_search = function (keyword, type, semester, callback) {
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
                if(doc.length===0){
                    rc();
                }
                doc.forEach(function (value ,index) {
                    var holder_id = "";
                    var holder_name = "";
                    var type_name = "";
                    var type_num = ["0"];
                    if(value.private){
                        // console.log("因非公开淘汰"+value.name);
                        if(index===doc.length-1){
                            rc();
                            return;
                        }else{
                            return;
                        }
                    }
                    if(value.semester!==semester){
                        // console.log("因学期淘汰"+value.name);
                        if(index===doc.length-1){
                            rc();
                            return;
                        }else{
                            return;
                        }
                    }
                    if(!value.professor_id){
                        holder_id = value.creator_id;
                        type_name = "公开事件";
                        type_num = ["0","2","3"];
                    }else{
                        holder_id = value.professor_id;
                        if(value.e_course){
                            type_name = "选修课程";
                            type_num = ["0","1","3","4"];
                        }else{
                            type_name = "课程";
                            type_num = ["3","4"];
                        }
                    }
                    if(type_num.indexOf(type)===-1){
                        // console.log(type_num.indexOf(type)+"因类型条件淘汰"+value.name);
                        if(index===doc.length-1){
                            rc();
                            return;
                        }else{
                            return;
                        }
                    }
                    User.findById(holder_id, function (err, res) {
                        holder_name = res.name;
                        var event_obj = {
                            _id: value._id,
                            name: value.name,
                            // holder_id: holder_id,
                            holder_name: holder_name,
                            type: type_name,
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
        that.event_search(that.keyword, that.type, that.semester, callback);
    };
    this.getResult = function () {
        return res_json;
    }
}

module.exports = event_search;