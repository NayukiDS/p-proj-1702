var mongoose = require('mongoose');
var db_info = require('../app/models/mongoose_connection');
mongoose.connect('mongodb://'
    +db_info.user_name +':'
    +db_info.user_passwd +'@'
    +db_info.address+':'
    +db_info.port+'/'
    +db_info.db+'');

var Course = require('../app/models/course');
var Schedule = require('../app/models/schedule_json');

var fs = require('fs');
var json_file = './courses.json';
var json_obj = JSON.parse(fs.readFileSync(json_file,'utf8'));
json_obj.forEach(function (t) {
    var course = new Course;
    var schedule = new Schedule();
    course._id = t._id;
    course.name = t.name;
    course.semester = t.semester;
    course.professor_id = t.professor_id;
    course.student_r_id = t.student_r_id;
    course.e_course = t.e_course;
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
