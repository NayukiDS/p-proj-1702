var express = require('express');
var app = express();

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

var Course_list_get_by_week = require('./app/actions/course_list_get_by_week');
router.route('/course_list')
    .get(function (req, res) {
        // var d_id = req.query.desk_id;
        var d_id = "5a520da6d70e0138f4673fd0";
        var day = req.query.activeIndex;
        // var week = req.query.week;
        var week = 10;
        var course_get = new Course_list_get_by_week(d_id,week);
        course_get.do_exec();
        setTimeout(function () {
            var res_json = course_get.getResult();
            var day_int = parseInt(day);
            // console.log(res_json[day_int]);
            // if(day>=1&&day<=7){
            if(day>=0&&day<=6){
                // day_int -= 1;
                res.json(res_json[day_int].courses);
            }else{
                res.status(500).json({info:"bad activeIndex request!"});
            }
        },50);
    });