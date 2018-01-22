var View_desk_event = require('../models/view_desk_event_detail');

function course_add(value,value2,professor_name,res_json_mo,res_json_tu,res_json_we,res_json_th,res_json_fr,res_json_sa,res_json_su){
    var temp = new Object();
    temp._id = value._id;
    temp.name = value.name;
    temp.location = value2.location;
    // temp.professor_id = value.professor_id;
    temp.professor_name = professor_name;
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

function event_list_get_by_sweek(d_id, semester, week) {
    var res_json = {};
    var res_json_mo = [];
    var res_json_tu = [];
    var res_json_we = [];
    var res_json_th = [];
    var res_json_fr = [];
    var res_json_sa = [];
    var res_json_su = [];
    var that = this;
    this.getResult = function () {
        var res_str =
            '[' +
            '{"day":"su","courses":'+ JSON.stringify(res_json_su) + '},' +
            '{"day":"mo","courses":'+ JSON.stringify(res_json_mo) + '},' +
            '{"day":"tu","courses":'+ JSON.stringify(res_json_tu) + '},' +
            '{"day":"we","courses":'+ JSON.stringify(res_json_we) + '},' +
            '{"day":"th","courses":'+ JSON.stringify(res_json_th) + '},' +
            '{"day":"fr","courses":'+ JSON.stringify(res_json_fr) + '},' +
            '{"day":"sa","courses":'+ JSON.stringify(res_json_sa) + '}' +
            ']';
        res_json = JSON.parse(res_str);
        return res_json;
    };
    this.getEvents = function (desk_id, callback, pre) {
        if(!pre)pre = false;
        // var promise = View_desk_event.find({
        //     '_id': desk_id.toString()
        // })
        var promise = View_desk_event
        .findById(desk_id)
        .select({
            pre_desk: 1,
            event_docs: 1,
            professor_docs: 1
        })
        .exec();

        promise.then(
            function (result) {
                var res_init = JSON.stringify(result);
                res_init = JSON.parse(res_init);
                // res_init = res_init[0];
                res_init.event_docs.forEach(function (value, i) {
                    if(value.semester!==semester)return;
                    // if(value.private)return;
                    value.schedule.forEach(function (value2) {
                        for(var index=0;index<=value2.week.length;index++){
                            if(value2.week[index]===week){
                                var professor_name = "unknown";
                                for(var x=0;x<res_init.professor_docs.length;x++){
                                    if(value.professor_id===res_init.professor_docs[x].bind_id){
                                        professor_name = res_init.professor_docs[x].name;
                                    }
                                }
                                // var professor_name = res_init.professor_docs[i].name;
                                course_add(value,value2,professor_name,res_json_mo,res_json_tu,res_json_we,res_json_th,res_json_fr,res_json_sa,res_json_su);
                                break;
                            }
                        }
                    })
                });


                if(res_init.pre_desk){
                    that.getEvents(res_init.pre_desk,callback);
                }else{
                    callback();
                }

                // console.log(res_init._id);
            },
            function (err) {
                console.log("error" + err);
                callback();
            }
        )
    };
    this.do_exec = function (callback) {
        that.getEvents(d_id,callback);
    };
}

module.exports = event_list_get_by_sweek;