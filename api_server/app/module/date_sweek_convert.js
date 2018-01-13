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

function date_sweek_convert(date,authentic) {
    if(!authentic)authentic=false;
    var date_json = {
        semester: -1,
        week: -1,
        day: -1,
        date: "1900-1-1",
        valid: false
    };
    var date_valid = new Date(date);
    if(!date_valid>0) date_valid = new Date(parseInt(date));
    if(!date_valid>0) return date_json;
    date_json.valid = true;

    date = date_valid;
    // date = Date.parse(date);
    date_json.date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
    for(var i=0;i<date_standard.length;i++){
        var week_check = Date.parse(date_standard[i].start_week);
        var week_need, week_ts;
        if(date<week_check){
            if(i===0){
                date_json.valid = false;
                break;
            }
            week_need = Date.parse(date_standard[i-1].start_week);
            week_ts = (date-week_need)/1000;
            date_json.semester = date_standard[i-1].semester;
            date_json.week = parseInt(week_ts/604800) + 1;
            date_json.day = date.getDay();
            break;
        }
        if(i===date_standard.length-1){
            week_need = Date.parse(date_standard[i].start_week);
            week_ts = (date-week_need)/1000;
            date_json.semester = date_standard[i].semester;
            date_json.week = parseInt(week_ts/604800) + 1;
            date_json.day = date.getDay();
            break;
        }
    }
    return date_json;
}

module.exports = date_sweek_convert;