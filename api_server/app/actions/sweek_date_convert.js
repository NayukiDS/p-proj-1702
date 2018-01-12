var date_standard = [
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

var date_sweek_convert = require('./date_sweek_convert');

function semesterExist(semester) {
    for(var i=0;i<date_standard.length;i++){
        if(date_standard[i].semester===semester) return date_standard[i].start_week;
    }
    return false;
}

function sweek_date_convert(sweek,authentic) {
    if(!sweek.day)sweek.day="1";
    if(!authentic)authentic=false;
    var date_json = {
        semester: -1,
        week: -1,
        day: -1,
        date: "1900-1-1",
        valid: false
    };
    var semester = parseInt(sweek.semester);
    if(!semester) return date_json;
    var date_valid = semesterExist(semester);
    if(!date_valid) return date_json;
    date_json.semester = semester;
    var date = Date.parse(date_valid);
    var week = parseInt(sweek.week);
    if(!week) return date_json;
    date_json.week = week;
    if(week>0)week-=1;
    date = date + week * 604800 * 1000;
    var day = parseInt(sweek.day);
    if(!day&&day!==0) return date_json;
    date_json.day = day;
    if(day===0)day+=7;
    day -= 1;
    date = date + day * 86400 * 1000;
    date = new Date(date);

    date_json.valid = true;
    console.log(date);
    console.log(typeof(date));

    date_json.date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();

    if(authentic){
        var authentic_json = date_sweek_convert(date_json.date);
        date_json.semester = authentic_json.semester;
        date_json.week = authentic_json.week;
    }

    return date_json;
}

module.exports = sweek_date_convert;