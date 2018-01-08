var mongoose = require('mongoose');
var db_info = require('../models/mongoose_connection');
mongoose.connect('mongodb://'
    +db_info.user_name +':'
    +db_info.user_passwd +'@'
    +db_info.address+':'
    +db_info.port+'/'
    +db_info.db+'');

var Course = require('../models/course');
var Schedule = require('../models/schedule_json');

var fs = require('fs');
var json_file = '../../sample_data/courses.json';
var json_obj = JSON.parse(fs.readFileSync(json_file,'utf8'));
json_obj.forEach(function (t) {
    var course = new Course;
    var schedule = new Schedule();
    course._id = t._id;
    course.bind_id = t.bind_id;
    course.name = t.name;
    course.admin = t.admin;
    course.admin_pd = t.admin_pd;
    course.authentic = t.authentic;
    course.class_id = t.class_id;
    course.desks = t.desks;
    var json_schedule = [];
    t.schedule.forEach(function (v) {
        schedule.setter(v.type,v.day,v.week,v.time,v.location);
        json_schedule.push(schedule.exportJSON());
    });
    course.schedule = json_schedule;
    course.schedule = JSON.stringify(json_schedule);
    course.schedule = JSON.parse(course.schedule);
    course.save(function (err) {
        if(err)console.log(err);
    })
});
