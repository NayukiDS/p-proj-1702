// var Course = require('../models/course');
var Course = require('../models/events_collection');
var date_sweek_convert  = require('../module/date_sweek_convert');

function event_create_course(name, semester, professor_id, student_r_id, e_course, schedule) {
    var res_json = {
        err: false,
        err_msg: "",
        status: 200,
        result: ""
    };
    var that = this;
    this.name = name;
    this.semester = semester;
    this.professor_id = professor_id;
    this.student_r_id = student_r_id;
    this.e_course = e_course;
    this.schedule = schedule;
    this.create = function (name, semester, professor_id, student_r_id, e_course, schedule) {
        if(e_course){
            e_course = true;
        }else{
            e_course = false;
        }
        var course = new Course;
        course.name = name;
        course.semester = semester;
        course.professor_id = professor_id;
        course.student_r_id = student_r_id;
        course.e_course = e_course;
        var json_schedule = [];
        schedule = decodeURI(schedule);
        try{
            schedule = JSON.parse(schedule);
        }catch (err){
            res_json.err = true;
            res_json.err_msg = "Could not parse schedule structure.";
            res_json.status = 400;
            callback();
            return false;
        }
        var wday_range = ["mo","tu","we","th","fr","sa","su"];
        schedule.forEach(function (value, index) {
            var obj = {};
            if(!value.type){
                obj.type = "";
            }else{
                obj.type = value.type;
            }

            if(!value.date){
                if(!value.day||wday_range.indexOf(value.day)){
                    syntax_error("day", index);
                }else{
                    obj.day = value.day;
                }
                if(!value.week||typeof(value.week)!=='object'){
                    syntax_error("week", index);
                }else{
                    obj.week = value.week;
                }
                obj.time = [];
                if(!value.time[0]||typeof(value.time[0])!=='number'){
                    syntax_error("time", index);
                }else{
                    obj.time[0] = value.time[0];
                }
                if(!value.time[1]||typeof(value.time[1])!=='number'){
                    syntax_error("time", index);
                }else{
                    obj.time[1] = value.time[1];
                }
                if(!value.location||typeof(value.location)!=='string'){
                    obj.location = "";
                }else{
                    obj.location = value.location;
                }
                json_schedule.push(obj);
            }else{
                if(!value.date||typeof(value.date)!=='string'){
                    syntax_error("date", index);
                }else{
                    var date_json = date_sweek_convert(value.date, false);
                    obj.day = date_json.day;
                    obj.week = date_json.week;
                }
                obj.time = [];
                if(!value.time[0]||typeof(value.time[0])!=='number'){
                    syntax_error("time", index);
                }else{
                    obj.time[0] = value.time[0];
                }
                if(!value.time[1]||typeof(value.time[1])!=='number'){
                    syntax_error("time", index);
                }else{
                    obj.time[1] = value.time[1];
                }
                if(!value.location||typeof(value.location)!=='string'){
                    obj.location = "";
                }else{
                    obj.location = value.location;
                }
                json_schedule.push(obj);
            }
        });

        course.schedule = json_schedule;
        course.schedule = JSON.stringify(json_schedule);
        course.schedule = JSON.parse(course.schedule);
        var promise = course.save();
        promise.then(
            function (result) {
                res_json.result = {
                    info: "success"
                };
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
        );

        function syntax_error(type, index) {
            res_json.err = true;
            res_json.err_msg = "Syntax error when parse schedule structure on '["+index+"]."+type+"'.";
            res_json.status = 400;
            callback();
            return false;
        }
    };
    this.do_exec = function (callback) {
        that.create(that.name, that.semester, that.professor_id, that.student_r_id, that.e_course, that.schedule, callback);
    };
    this.getResult = function () {
        return res_json;
    }
}

module.exports = event_create_course;