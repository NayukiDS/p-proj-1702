var mongoose = require('mongoose');
var db_info = require('../app/models/mongoose_connection');
mongoose.connect('mongodb://'
    +db_info.user_name +':'
    +db_info.user_passwd +'@'
    +db_info.address+':'
    +db_info.port+'/'
    +db_info.db+'');

var Comment = require('../app/models/comment');

var fs = require('fs');
var json_file = './comments.json';
var json_obj = JSON.parse(fs.readFileSync(json_file,'utf8'));
json_obj.forEach(function (t) {
    var comment = new Comment;
    comment._id = t._id;
    comment.pre_comment = t.pre_comment;
    comment.user_id = t.user_id;
    comment.event_id = t.event_id;
    comment.add_ts = t.add_ts;
    comment.focus = t.focus;
    comment.available = t.available;
    comment.content = t.content;
    comment.save(function (err) {
        if(err)console.log(err);
    })
});
