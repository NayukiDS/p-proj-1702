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
    var date = new Date();
    console.log(
        "---------------------------------------------\n" +
        date + "\n" +
        req.method + " request from:\n" +
        req.ip+" which requested\n" +
        req.originalUrl
        // "-------------------------------\n"
    );
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

router.route('/api_key/test')
    .get(function (req, res) {
        var client = req.query.client;
        var user_id = req.query.user_id;
        var open_id = req.query.open_id;

        var key = new KEY();
        var api_key = key.getAPI_KEY(client, user_id, open_id);
        key.sessionSave(user_id, client, api_key, rc);

        function rc() {
            // var res_json = key.getRes_sessionSave();
            res.json({key: api_key});
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
            auth_client = check.checkQRvalid(auth_client);
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
            if(key.getRes_sessionCheck().valid){
                u_info = new user_info(user_id, owner);
                u_info.do_exec(rc);
            }else{
                res.status(401).json({info:"authentication failed"});
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

var desk_new = require('./app/actions/desk_new');
var desk_delete = require('./app/actions/desk_delete');
router.route('/desk')
    .post(function (req, res) {
        var key, user_id, dn;
        var api_key = req.query.api_key;
        if(!api_key) api_key = req.body.api_key;
        var pre_desk = req.query.pre_desk;
        if(!pre_desk) pre_desk = req.body.pre_desk;
        var name = req.query.name;
        if(!name) name = req.body.name;
        var bind_class = req.query.bind_class;
        if(!bind_class) bind_class = req.body.bind_class;
        if(api_key){
            api_key = api_key.split(' ').join('+');
            key = new KEY(api_key);
            key.reset_key_data();
            user_id = key.getUser_id();
            key.sessionCheck(api_key, co);
        }else{
            res.status(400).json({info:"invalid api_key"});
        }

        function co() {
            if(key.getRes_sessionCheck().valid){
                dn = new desk_new(user_id, pre_desk, name, bind_class);
                dn.do_exec(rc);
            }else{
                res.status(401).json({info:"authentication failed"});
            }
        }

        function rc() {
            var res_json = dn.getResult();
            if(res_json.status!==200){
                res.status(res_json.status).json(res_json.result);
            }else{
                res.status(res_json.status).json(res_json.err_msg);
            }
        }
    })
    .delete(function (req, res) {
            var key, user_id, dd;
            var api_key = req.query.api_key;
            if(!api_key) api_key = req.body.api_key;
            var desk_id = req.query.desk_id;
            if(!desk_id) desk_id = req.body.desk_id;
            if(api_key){
                api_key = api_key.split(' ').join('+');
                key = new KEY(api_key);
                key.reset_key_data();
                user_id = key.getUser_id();
                key.sessionCheck(api_key, co);
            }else{
                res.status(400).json({info:"invalid api_key"});
            }

            function co() {
                if(key.getRes_sessionCheck().valid){
                    dd = new desk_delete(user_id, desk_id);
                    dd.do_exec(rc);
                }else{
                    res.status(401).json({info:"authentication failed"});
                }
            }

            function rc() {
                var res_json = dd.getResult();
                if(res_json.status===200){
                    res.status(res_json.status).json({info: "success"});
                }else{
                    res.status(res_json.status).json({info:res_json.err_msg});
                }
            }
    });

var event_list_get_by_sweek = require('./app/actions/event_list_get_by_sweek');
var date_sweek_convert = require('./app/module/date_sweek_convert');

var event_create_course = require('./app/actions/event_create_course');
router.route('/event/course')
    .post(function (req, res) {
        var api_key = req.body.api_key;
        var name = req.body.name;
        var semester = req.body.semester;
        var professor_id = req.body.professor_id;
        var student_r_id = req.body.student_r_id;
        var e_course = req.body.e_course;
        var schedule = req.body.schedule;
        var key, ecc;

        if(!name){
            res.status(400).json({info:"invalid name"});
            return;
        }
        if(!semester){
            res.status(400).json({info:"invalid semester"});
            return;
        }
        if(!professor_id){
            res.status(400).json({info:"invalid professor_id"});
            return;
        }
        if(!student_r_id){
            student_r_id = "";
        }
        if(!e_course){
            e_course = false;
        }
        if(!schedule){
            res.status(400).json({info:"invalid schedule"});
            return;
        }

        if(api_key){
            api_key = api_key.split(' ').join('+');
            key = new KEY(api_key);
            key.reset_key_data();
            key.sessionCheck(api_key, co);
        }else{
            res.status(400).json({info:"invalid api_key"});
        }

        function co() {
            if(key.getRes_sessionCheck().valid){
                ecc = new event_create_course(name, semester, professor_id, student_r_id, e_course, schedule);
                ecc.do_exec(rc);
            }else{
                res.status(401).json({info:"authentication failed"});
            }
        }

        function rc() {
            var res_json = ecc.getResult();
            if(res_json.status===200){
                res.status(res_json.status).json({info: "success"});
            }else{
                res.status(res_json.status).json({info:res_json.err_msg});
            }
        }
    });

var event_create_event = require('./app/actions/event_create_event');
router.route('/event/event')
    .post(function (req, res) {
        var api_key = req.query.api_key;
        if(!api_key) api_key = req.body.api_key;
        var d_id = req.query.desk_id;
        if(!d_id) d_id = req.body.desk_id;
        var name = req.query.name;
        if(!name) name = req.body.name;
        var semester = req.query.semester;
        if(!semester) semester = req.body.semester;
        var v_private = req.query.private;
        if(!v_private) v_private = req.body.private;
        var schedule = req.query.schedule;
        if(!schedule) schedule = req.body.schedule;
        var content = req.query.content;
        if(!content) content = req.body.content;
        var key, creator_id, ece;

        if(!d_id){
            res.status(400).json({info:"invalid desk_id"});
            return;
        }
        if(!name){
            res.status(400).json({info:"invalid name"});
            return;
        }
        if(!semester){
            semester = "201701";
        }
        if(!v_private){
            v_private = false;
        }
        if(!content){
            content = "";
        }
        if(!schedule){
            res.status(400).json({info:"invalid schedule"});
            return;
        }

        if(api_key){
            api_key = api_key.split(' ').join('+');
            key = new KEY(api_key);
            key.reset_key_data();
            creator_id = key.getUser_id();
            key.sessionCheck(api_key, co);
        }else{
            res.status(400).json({info:"invalid api_key"});
        }

        function co() {
            if(key.getRes_sessionCheck().valid){
                ece = new event_create_event(d_id, name, semester, creator_id, v_private, schedule, content);
                ece.do_exec(rc);
            }else{
                res.status(401).json({info:"authentication failed"});
            }
        }

        function rc() {
            var res_json = ece.getResult();
            if(res_json.status===200){
                res.status(res_json.status).json({info: "success"});
            }else{
                res.status(res_json.status).json({info:res_json.err_msg});
            }
        }
    });

router.route('/event_list')
    .get(function (req, res) {
        // var desk_id = req.query.desk_id;
        var desk_id = "5a520da6d70e0138f4673fd0";
        var date = req.query.date;
        var api_key = req.query.api_key;
        var date_json = date_sweek_convert(date);
        if(!date_json.valid){
            res.status(400).json({info:"invalid date."});
            return;
        }

        var key, user_id, event_get;
        if(api_key){
            api_key = api_key.split(' ').join('+');
            key = new KEY(api_key);
            key.reset_key_data();
            user_id = key.getUser_id();
            key.sessionCheck(api_key, co);
        }else{
            res.status(400).json({info:"invalid api_key"});
        }

        function co() {
            if(key.getRes_sessionCheck().valid){
                event_get = new event_list_get_by_sweek(desk_id,date_json.semester,date_json.week);
                event_get.do_exec(rc);
            }else{
                res.status(401).json({info:"authentication failed"});
            }
        }

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

var event_search = require('./app/actions/event_search');
router.route('/event_search')
    .get(function (req, res) {
        var keyword = req.query.keyword;
        var filter_type = req.query.filter_type;
        var filter_semester = req.query.filter_semester;
        if(!keyword){
            res.status(400).json({info:"invalid keyword."});
            return;
        }else{
            keyword = decodeURI(keyword);
        }
        var f_type = ["0","1","2","3","4"];
        if(!filter_type){
            filter_type="0"
        }else{
            if(f_type.indexOf(filter_type)===-1){
                res.status(400).json({info:"invalid filter_type."});
                return;
            }
        }
        if(!filter_semester){
            filter_semester=201701;
        }else{
            filter_semester = parseInt(filter_semester);
            if(!filter_semester){
                res.status(400).json({info:"invalid filter_semester."});
                return;
            }
        }
        var es = new event_search(keyword, filter_type, filter_semester);
        es.do_exec(rc);

        function rc() {
            var res_json = es.getResult();
            if(res_json.status===200){
                res.status(res_json.status).json(res_json.result);
            }else{
                res.status(res_json.status).json(res_json);
            }
        }
    });

var event_bind_desk = require('./app/actions/event_bind_desk');
router.route('/bind')
    .put(function (req, res) {
        var api_key = req.query.api_key;
        if(!api_key) api_key = req.body.api_key;
        var desk_id = req.query.desk_id;
        if(!desk_id) desk_id = req.body.desk_id;
        var event_id = req.query.event_id;
        if(!event_id) event_id = req.body.event_id;
        var bool = req.query.bool;
        if(!bool) event_id = req.body.bool;

        if(!desk_id){
            res.status(400).json({info:"invalid desk_id."});
            return;
        }
        if(!event_id){
            res.status(400).json({info:"invalid event_id."});
            return;
        }

        var ebd, key;
        if(api_key){
            api_key = api_key.split(' ').join('+');
            key = new KEY(api_key);
            key.reset_key_data();
            key.sessionCheck(api_key, co);
        }else{
            res.status(400).json({info:"invalid api_key"});
        }

        function co() {
            if(key.getRes_sessionCheck().valid){
                ebd = new event_bind_desk(desk_id, event_id);
                if(bool){
                    ebd.e_bind(rc);
                }else{
                    ebd.a_bind(rc);
                }
            }else{
                res.status(401).json({info:"authentication failed"});
            }
        }

        function rc() {
            var res_json = ebd.getResult();
            if(res_json.status===200){
                res.status(res_json.status).json({info: "success"});
            }else{
                res.status(res_json.status).json({info:res_json.err_msg});
            }
        }

    });

var comment_list_get_by_event = require('./app/actions/comment_list_get_by_event');
var comment_delete = require('./app/actions/comment_delete');
var comment_create = require('./app/actions/comment_create');

router.route('/comment')
    .post(function (req, res) {
        var pre_comment_id = req.query.pre_comment_id;
        if(!pre_comment_id) pre_comment_id = req.body.pre_comment_id;
        var api_key = req.query.api_key;
        if(!api_key) api_key = req.body.api_key;
        var event_id = req.query.event_id;
        if(!event_id) event_id = req.body.event_id;
        var content = req.query.content;
        if(!content) content = req.body.content;

        var key, user_id, comment_new;
        if(!pre_comment_id){
            // res.status(400).json({info:"invalid pre_comment_id"});
            // return;
            pre_comment_id = "";
        }
        if(!event_id){
            res.status(400).json({info:"invalid event_id"});
            return;
        }
        if(!content){
            res.status(400).json({info:"invalid content"});
            return;
        }
        if(api_key){
            api_key = api_key.split(' ').join('+');
            key = new KEY(api_key);
            key.reset_key_data();
            user_id = key.getUser_id();
            key.sessionCheck(api_key, co);
        }else{
            res.status(400).json({info:"invalid api_key"});
        }

        function co() {
            if(key.getRes_sessionCheck().valid){
                comment_new = new comment_create(pre_comment_id, user_id, event_id, content);
                comment_new.do_exec(rc);
            }else{
                res.status(401).json({info:"authentication failed"});
            }
        }

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
        if(!comment_id) comment_id = req.body.comment_id;
        if(!comment_id){
            res.status(400).json({info:"invalid comment_id"});
            return;
        }
        var api_key = req.query.api_key;
        if(!api_key) api_key = req.body.api_key;

        var key, user_id, comment_get;
        if(api_key){
            api_key = api_key.split(' ').join('+');
            key = new KEY(api_key);
            key.reset_key_data();
            user_id = key.getUser_id();
            key.sessionCheck(api_key, co);
        }else{
            res.status(400).json({info:"invalid api_key"});
        }

        function co() {
            if(key.getRes_sessionCheck().valid){
                comment_get = new comment_delete(comment_id);
                comment_get.do_exec(rc);
            }else{
                res.status(401).json({info:"authentication failed"});
            }
        }

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

router.route('/comment_list')
    .get(function (req, res) {
        var api_key = req.query.api_key;
        if(!api_key) api_key = req.body.api_key;
        var event_id = req.query.event_id;
        if(!event_id){
            res.status(400).json({info:"invalid event_id"});
            return;
        }
        var key, user_id, comment_get;
        if(api_key){
            api_key = api_key.split(' ').join('+');
            key = new KEY(api_key);
            key.reset_key_data();
            user_id = key.getUser_id();
            key.sessionCheck(api_key, co);
        }else{
            res.status(400).json({info:"invalid api_key"});
        }

        function co() {
            if(key.getRes_sessionCheck().valid){
                comment_get = new comment_list_get_by_event(event_id);
                comment_get.do_exec(rc);
            }else{
                res.status(401).json({info:"authentication failed"});
            }
        }

        function rc() {
            var res_json = comment_get.getResult();
            if(res_json.err){
                res.status(500).json({info:res_json.err_msg});
                return;
            }
            res.json(res_json.result);
        }
    });

var comment_available = require('./app/actions/comment_available');
router.route('/comment/available')
    .put(function (req, res) {
        var bool = req.query.bool;
        if(!bool) bool = req.body.bool;
        if(!bool){
            res.status(400).json({info:"invalid bool"});
            return;
        }else{
            var bool_range = ["0","1","2"];
            if(bool_range.indexOf(bool)===-1){
                res.status(400).json({info:"invalid bool"});
                return;
            }else{
                if(bool==='1')bool=true;
                if(bool==='0')bool=false;
                if(bool==='2')bool="";
            }
        }
        var comment_id = req.query.comment_id;
        if(!comment_id) comment_id = req.body.comment_id;
        if(!comment_id){
            res.status(400).json({info:"invalid comment_id"});
            return;
        }
        var ca = new comment_available(comment_id, bool);
        ca.do_exec(rc);

        function rc() {
            var res_json = ca.getResult();
            if(res_json.status===200){
                res.status(res_json.status).json(res_json.result);
            }else{
                res.status(res_json.status).json(res_json);
            }
        }
    });

var comment_focus = require('./app/actions/comment_focus');
router.route('/comment/focus')
    .put(function (req, res) {
        var bool = req.query.bool;
        if(!bool) bool = req.body.bool;
        if(!bool){
            res.status(400).json({info:"invalid bool"});
            return;
        }else{
            var bool_range = ["0","1","2"];
            if(bool_range.indexOf(bool)===-1){
                res.status(400).json({info:"invalid bool"});
                return;
            }else{
                if(bool==='1')bool=true;
                if(bool==='0')bool=false;
                if(bool==='2')bool="";
            }
        }
        var comment_id = req.query.comment_id;
        if(!comment_id) comment_id = req.body.comment_id;
        if(!comment_id){
            res.status(400).json({info:"invalid comment_id"});
            return;
        }
        var cf = new comment_focus(comment_id, bool);
        cf.do_exec(rc);

        function rc() {
            var res_json = cf.getResult();
            if(res_json.status===200){
                res.status(res_json.status).json(res_json.result);
            }else{
                res.status(res_json.status).json(res_json);
            }
        }
    });