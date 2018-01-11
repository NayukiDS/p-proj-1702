var View_desk_p_course_all = require('../models/view_desk_p_course_all');

function course_add(value,value2,res_json_mo,res_json_tu,res_json_we,res_json_th,res_json_fr,res_json_sa,res_json_su){
    var temp = new Object();
    temp._id = value._id;
    temp.name = value.name;
    temp.location = value2.location;
    temp.professor_id = value.professor_id;
    temp.student_r_id = value.student_r_id;
    temp.time = value2.time;
    temp.type = value2.type;
    switch(value2.day){
        case "mo":
            res_json_mo.push(temp);
            break;
        case "tu":
            res_json_tu.push(temp);
            break;
        case "we":
            res_json_we.push(temp);
            break;
        case "th":
            res_json_th.push(temp);
            break;
        case "fr":
            res_json_fr.push(temp);
            break;
        case "sa":
            res_json_sa.push(temp);
            break;
        case "su":
            res_json_su.push(temp);
            break;
    }
}

function course_list_get_by_week(d_id, week) {
    var res_json = {};
    var res_json_mo = [];
    var res_json_tu = [];
    var res_json_we = [];
    var res_json_th = [];
    var res_json_fr = [];
    var res_json_sa = [];
    var res_json_su = [];
    this.getResult = function () {
        return res_json;
    };
    this.do_exec = function () {
        var promise = View_desk_p_course_all.find({
            '_id': d_id.toString()
        })
        .select({
            pre_desk_courses: 1,
            desk_courses: 1
        })
        .exec();
        promise.then(
            function (result) {
                var res_init = JSON.stringify(result);
                res_init = JSON.parse(res_init);
                res_init = res_init[0];
                res_init.desk_courses.forEach(function (value) {
                    value.schedule.forEach(function (value2) {
                        for(var index=0;index<=value2.week.length;index++){
                            if(value2.week[index]===week){
                                course_add(value,value2,res_json_mo,res_json_tu,res_json_we,res_json_th,res_json_fr,res_json_sa,res_json_su);
                                break;
                            }
                        }
                    })
                });
                res_init.pre_desk_courses.forEach(function (value) {
                    value.schedule.forEach(function (value2) {
                        for(var index=0;index<=value2.week.length;index++){
                            if(value2.week[index]===week){
                                course_add(value,value2,res_json_mo,res_json_tu,res_json_we,res_json_th,res_json_fr,res_json_sa,res_json_su);
                                break;
                            }
                        }
                    })
                });
                var res_str = '[{"day":"mo","courses":'+ JSON.stringify(res_json_mo) +'},' +
                    '{"day":"tu","courses":'+ JSON.stringify(res_json_tu) +'},' +
                    '{"day":"we","courses":'+ JSON.stringify(res_json_we) +'},' +
                    '{"day":"th","courses":'+ JSON.stringify(res_json_th) +'},' +
                    '{"day":"fr","courses":'+ JSON.stringify(res_json_fr) +'},' +
                    '{"day":"sa","courses":'+ JSON.stringify(res_json_sa) +'},' +
                    '{"day":"su","courses":'+ JSON.stringify(res_json_su) +'}]';
                res_json = JSON.parse(res_str);
            },
            function (err) {
                console.log("error" + err);
            }
        )
    };
}

module.exports = course_list_get_by_week;