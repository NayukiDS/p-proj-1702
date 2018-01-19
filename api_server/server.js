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
    res.header("content-type", "application/json;charset=utf-8");
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
    // console.log('something happening...');
    console.log(req.method+" http request from:"+req.ip+" which request "+req.originalUrl);
    next();
});

app.use('/p-proj-1702',router);

var KEY = require('./app/module/KEY');

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
            var key = new KEY();
            var res_obj = JSON.parse(res_str);
            if(res_obj.errcode){
                res.status(401).json(res_obj);
                return;
            }
            res_str = key.getAPI_KEY("wechat", undefined, res_obj.openid);
            res.json({
                api_key:res_str,
                session_key: res_obj.session_key
            });
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

var user_create = require('./app/actions/user_create');
router.route('/user')
    .get( function (req, res) {
        var api_key = req.query.api_key;
        var auth_client = req.query.auth_client;
        if(!api_key){
            res.status(400).json({info:"invalid api_key"});
            return;
        }
        if(!auth_client){
            res.status(400).json({info:"invalid auth_client"});
            return;
        }else{
            var check = new KEY();
            var auth_client = check.checkQRvalid(auth_client);
            if(!auth_client){
                res.status(401).json({info:"auth_client unavailable"});
                return;
            }
        }
        api_key = api_key.split(' ').join('+');
        var key = new KEY(api_key);
        if(!key.reset_key_data()){
            res.status(400).json({info:"invalid api_key format"});
            return;
        }
        var new_key = key.getAPI_KEY(auth_client, key.getUser_id(),key.getOID());
        key.sessionSave(undefined, undefined, new_key, rc);

        function rc() {
            var res_json = key.getRes_sessionSave();
            if(res_json.err){
                res.status(500).json({info:res_json.err_msg});
                return;
            }
            res.json({info: "success"});
        }
    })
    .post(function (req, res) {
        var api_key = req.query.api_key;
        if(!api_key) api_key = req.body.api_key;
        var name = req.query.name;
        if(!name) name = req.body.name;
        var avatar_url = req.query.avatar_url;
        if(!avatar_url) avatar_url = req.body.avatar_url;
        var bind_id = req.query.bind_id;
        if(!bind_id) bind_id = req.body.bind_id;
        var open_id = undefined;
        if(api_key){
            api_key = api_key.split(' ').join('+');
            var key = new KEY(api_key);
            key.reset_key_data();
            open_id = key.getOID();
            if(!open_id){
                res.status(401).json({info:"authentication failed"});
                return;
            }
        }else{
            res.status(400).json({info:"invalid api_key"});
            return;
        }
        if(!name){
            res.status(400).json({info:"invalid name"});
            return;
        }
        if(!avatar_url){
            res.status(400).json({info:"invalid avatar_url"});
            return;
        }

        var user_new = new user_create(open_id, avatar_url, name, bind_id);
        user_new.do_exec(rc);

        var new_key;
        function rc() {
            var res_json = user_new.getResult();
            if(res_json.err){
                res.status(res_json.status).json({info:res_json.err_msg});
                return;
            }
            // res.json(res_json.result);
            new_key = key.getAPI_KEY('wechat', res_json.result._id , res_json.wechat_id);
            key.sessionSave(res_json.result._id, 'wechat', new_key, rc_save);
        }

        function rc_save() {
            res.json({api_key: new_key});
        }
    });

var user_info = require('./app/actions/user_info');
router.route('/user_info')
    .get(function (req, res) {
        var api_key = req.query.api_key;
        var user_id = req.query.user_id;
        var key;
        var owner = false;
        var u_info = undefined;

        if(api_key){
            api_key = api_key.split(' ').join('+');
            key = new KEY(api_key);
            key.reset_key_data();
            if(!user_id){
                user_id = key.getUser_id();
            }
            if(user_id===key.getUser_id()){
                owner = true;
            }
            key.sessionCheck(api_key, co);
        }else{
            res.status(400).json({info:"invalid api_key"});
        }

        function co() {
            if(key.getRes_sessionCheck()){
                u_info = new user_info(user_id, owner);
                u_info.do_exec(rc);
            }else{
                res.status(401).json({info:"invalid api_key"});
            }
        }

        function rc() {
            var res_json = u_info.getResult();
            if(res_json.err){
                res.status(500).json({info:res_json.err_msg});
                return;
            }
            res.json(res_json.result);
        }
    });

var event_list_get_by_sweek = require('./app/actions/event_list_get_by_sweek');
var date_sweek_convert = require('./app/module/date_sweek_convert');
router.route('/event_list')
    .get(function (req, res) {
        // var d_id = req.query.desk_id;
        var d_id = "5a520da6d70e0138f4673fd0";
        var date = req.query.date;
        // console.log("req_date:"+date);
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
        if(!pre_comment_id) pre_comment_id = req.body.pre_comment_id;
        var user_id = req.query.user_id;
        if(!user_id) user_id = req.body.user_id;
        var event_id = req.query.event_id;
        if(!event_id) event_id = req.body.event_id;
        var content = req.query.content;
        if(!content) content = req.body.content;

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
