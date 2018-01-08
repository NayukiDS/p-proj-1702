var mongoose = require('mongoose');
var db_info = require('../models/mongoose_connection');
mongoose.connect('mongodb://'
    +db_info.user_name +':'
    +db_info.user_passwd +'@'
    +db_info.address+':'
    +db_info.port+'/'
    +db_info.db+'');

var User = require('../models/user');
var Info = require('../models/info_json');

var fs = require('fs');
var json_file = '../../sample_data/users.json';
var json_obj = JSON.parse(fs.readFileSync(json_file,'utf8'));
json_obj.forEach(function (t) {
    var user = new User;
    var info = new Info();
    user.wechat_id = t.wechat_id;
    user.bind_id = t.bind_id;
    user.name = t.name;
    user.admin = t.admin;
    user.admin_pd = t.admin_pd;
    user.authentic = t.authentic;
    user.class_id = t.class_id;
    user.desks = t.desks;
    info.setter(t.info.office,t.info.phone,t.info.email);
    user.info = JSON.stringify(info.exportJSON());
    user.info = JSON.parse(user.info);
    user.save(function (err) {
        if(err)console.log(err);
    })
});
