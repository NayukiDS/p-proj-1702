var mongoose = require('mongoose');
var db_info = require('../app/models/mongoose_connection');
mongoose.connect('mongodb://'
    +db_info.user_name +':'
    +db_info.user_passwd +'@'
    +db_info.address+':'
    +db_info.port+'/'
    +db_info.db+'');

var Desk = require('../app/models/desk');

var fs = require('fs');
var json_file = './desks.json';
var json_obj = JSON.parse(fs.readFileSync(json_file,'utf8'));
json_obj.forEach(function (t) {
   var desk = new Desk;
   desk._id = t._id;
   desk.pre_desk = t.pre_desk;
   desk.name = t.name;
   desk.bind_class = t.bind_class;
   desk.courses = t.courses;
   desk.save(function (err) {
       if(err)console.log(err);
   })
});