var mongoose = require('mongoose');
var db_info = require('../models/mongoose_connection');
mongoose.connect('mongodb://'
    +db_info.user_name +':'
    +db_info.user_passwd +'@'
    +db_info.address+':'
    +db_info.port+'/'
    +db_info.db+'');

var Class_schema = require('../models/class');

var fs = require('fs');
var json_file = '../../sample_data/classes.json';
var json_obj = JSON.parse(fs.readFileSync(json_file,'utf8'));
json_obj.forEach(function (t) {
    var class_schema = new Class_schema;
    class_schema._id = t._id;
    class_schema.college = t.college;
    class_schema.major = t.major;
    class_schema.year = t.year;
    class_schema.name = t.name;
    class_schema.teacher_id = t.teacher_id;
    class_schema.desk_id  = t.desk_id;
    class_schema.save(function (err) {
        if(err)console.log(err);
    })
});
