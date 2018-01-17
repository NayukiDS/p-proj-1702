var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.static('res'));
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

var mongoose = require('mongoose');
var db_info = require('./app/models/mongoose_connection');
mongoose.connect('mongodb://'
    +db_info.user_name +':'
    +db_info.user_passwd +'@'
    +db_info.address+':'
    +db_info.port+'/'
    +db_info.db+'');
//----HTTPS
// var https = require('https')
//     ,fs = require("fs");
//
//
// var options = {
//     key: fs.readFileSync('./ssl/privkey.pem'),
//     cert: fs.readFileSync('./ssl/fullchain.pem')
// };
//
// https.createServer(options, app).listen(443, function () {
//     console.log('Https server listening on port ' + 443);
// });
//----HTTP
var port = process.env.PORT || 80;
app.listen(port);
//----END

var router = express.Router();

router.use(function(req, res, next){
    console.log('something happening...');
    next();
});

app.use('/p-proj-1702',router);

router.route('/test_api')
    .get(function (req, res){
        res.json({info:"GET form Mamoru"});});

var Apply_auth_wechat = require('./app/actions/apply_auth_wechat');
router.route('/api_key')
    .get(function (req, res) {
        var js_code = req.query.code;
        if(!js_code){
            res.status(400).json({info:"invalid js_code"});
            return;
        }
        var aaw = new Apply_auth_wechat(js_code);
        aaw.do_exec(rc);

        function rc() {
            var res_str = aaw.getResult();
            res.send(res_str);
        }
        // console.log(req.query.code);
        // res.json({info: "boy next door"});

    });

var Course_list_get_by_week = require('./app/actions/course_list_get_by_week');
var date_sweek_convert = require('./app/module/date_sweek_convert');
router.route('/course_list')
    .get(function (req, res) {
        // var d_id = req.query.desk_id;
        var d_id = "5a520da6d70e0138f4673fd0";
        var date = req.query.date;
        console.log("req_date:"+date);
        var date_json = date_sweek_convert(date);
        if(!date_json.valid){
            res.status(400).json({info:"invalid date."});
            return;
        }
        var course_get = new Course_list_get_by_week(d_id,date_json.semester,date_json.week);
        course_get.do_exec(rc);

        function rc() {
            var res_json = course_get.getResult();
            var res_obj = {
                semester: date_json.semester,
                week: date_json.week,
                day: date_json.day,
                date: date_json.date,
                event_list: []
            };
            var course_list = res_json[date_json.day];
            if(course_list!==undefined){
                res_obj.event_list = course_list.courses;
                res.json(res_obj);
                // res.json(course_list.courses);
            }else {
                // res.status(500).json([]);
                res.json(res_obj);
            }
        }
    });

var event_list_get_by_sweek = require('./app/actions/event_list_get_by_sweek');
router.route('/event_list')
    .get(function (req, res) {
        // var d_id = req.query.desk_id;
        var d_id = "5a520da6d70e0138f4673fd0";
        var date = req.query.date;
        console.log("req_date:"+date);
        var date_json = date_sweek_convert(date);
        if(!date_json.valid){
            res.status(400).json({info:"invalid date."});
            return;
        }
        var event_get = new event_list_get_by_sweek(d_id,date_json.semester,date_json.week);
        event_get.do_exec(rc);

        function rc() {
            var res_json = event_get.getResult();
            var res_obj = {
                semester: date_json.semester,
                week: date_json.week,
                day: date_json.day,
                date: date_json.date,
                event_list: []
            };
            var event_list = res_json[date_json.day];
            if(event_list!==undefined){
                res_obj.event_list = event_list.courses;
                res.json(res_obj);
                // res.json(course_list.courses);
            }else {
                // res.status(500).json([]);
                res.json(res_obj);
            }
        }
    });

var comment_list_get_by_event = require('./app/actions/comment_list_get_by_event');
var comment_delete = require('./app/actions/comment_delete');
var comment_create = require('./app/actions/comment_create');
router.route('/comment_list')
    .get(function (req, res) {
        var event_id = req.query.event_id;
        if(!event_id){
            res.status(400).json({info:"invalid event_id"});
            return;
        }
        // var event_id = "1600231";
        var comment_get = new comment_list_get_by_event(event_id);
        comment_get.do_exec(rc);

        function rc() {
            var res_json = comment_get.getResult();
            if(res_json.err){
                res.status(500).json({info:res_json.err_msg});
                return;
            }
            res.json(res_json.result);
        }
    })
    .post(function (req, res) {
        var pre_comment_id = req.query.pre_comment_id;
        var user_id = req.query.user_id;
        var event_id = req.query.event_id;
        var content = req.query.content;

        if(!pre_comment_id){
            // res.status(400).json({info:"invalid pre_comment_id"});
            // return;
            pre_comment_id = "";
        }
        if(!user_id){
            res.status(400).json({info:"invalid user_id"});
            return;
        }
        if(!event_id){
            res.status(400).json({info:"invalid event_id"});
            return;
        }
        if(!content){
            res.status(400).json({info:"invalid content"});
            return;
        }
        // var event_id = "1600231";
        var comment_new = new comment_create(pre_comment_id, user_id, event_id, content);
        comment_new.do_exec(rc);

        function rc() {
            var res_json = comment_new.getResult();
            if(res_json.err){
                res.status(500).json({info:res_json.err_msg});
                return;
            }
            res.json(res_json.result);
        }
    })
    .delete(function (req, res) {
        var comment_id = req.query.comment_id;
        if(!comment_id){
            res.status(400).json({info:"invalid comment_id"});
            return;
        }
        // var event_id = "1600231";
        var comment_get = new comment_delete(comment_id);
        comment_get.do_exec(rc);

        function rc() {
            var res_json = comment_get.getResult();
            if(res_json.err){
                res.status(500).json({info
                        :res_json.err_msg});
                return;
            }
            res.json(res_json.result);
        }
    });

router.route('/semester_list')
    .get(function (req, res) {
        var date_json = [
            {
                semester: 201601,
                start_week: "2016/9/7"
            },
            {
                semester: 201602,
                start_week: "2017/2/22"
            },
            {
                semester: 201701,
                start_week: "2017/9/4"
            },
            {
                semester: 201702,
                start_week: "2018/3/26"
            }
        ];
        res.json(date_json);
    });