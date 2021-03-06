var mongoose = require('mongoose');
var db_info = require('../app/models/mongoose_connection');
mongoose.connect('mongodb://'
    +db_info.user_name +':'
    +db_info.user_passwd +'@'
    +db_info.address+':'
    +db_info.port+'/'
    +db_info.db+'');

var User = require('../app/models/user');
var Info = require('../app/models/info_json');

var fs = require('fs');
var json_file = './users.json';
var json_obj = JSON.parse(fs.readFileSync(json_file,'utf8'));
json_obj.forEach(function (t) {
    var user = new User;
    var info = new Info();
    // if(t._id!==""||t._id!==undefined)user._id = t._id;
    // user._id = t._id;
    user.wechat_id = t.wechat_id;
    user.wechat_avatar = t.wechat_avatar;
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
