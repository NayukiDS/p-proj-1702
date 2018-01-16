var server_address = '127.0.0.1';
var server_http = 'http';

var semester_list = [];

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
    for(var i=0;i<semester_list.length;i++){
        var week_check = Date.parse(semester_list[i].start_week);
        var week_need, week_ts;
        if(date<week_check){
            if(i===0){
                date_json.valid = false;
                break;
            }
            week_need = Date.parse(semester_list[i-1].start_week);
            week_ts = (date-week_need)/1000;
            date_json.semester = semester_list[i-1].semester;
            date_json.week = parseInt(week_ts/604800) + 1;
            date_json.day = date.getDay();
            break;
        }
        if(i===semester_list.length-1){
            week_need = Date.parse(semester_list[i].start_week);
            week_ts = (date-week_need)/1000;
            date_json.semester = semester_list[i].semester;
            date_json.week = parseInt(week_ts/604800) + 1;
            date_json.day = date.getDay();
            break;
        }
    }
    return date_json;
}

function get_semester_list() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', server_http + '://' + server_address
        + '/p-proj-1702/semester_list', true);
    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');

    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                var res_data = JSON.parse(this.response);
                semester_list = res_data;
                calendar_init();
                $('.day_today').trigger('click');
            }
        }
    };
    xhr.send();
}

function get_events_by_date_array() {
    get_events_by_date(date_multi ,0)
}

var event_multi = [
    [],[],[],[],[],[],[]
    // {},{},{},{},{},{},{}
];

function get_events_by_date(date_short, index) {
    if(!date_short[index]) return false;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', server_http + '://' + server_address
        + '/p-proj-1702/event_list'
        // + '?date=' + date_short[index].exportFormatDate(), true);
        + '?date=' + date_short[index].s_year+"-"+date_short[index].s_month+"-"+date_short[index].s_date, true);
    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');

    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                var res_data = JSON.parse(this.response);
                // console.log(res_data);
                var a = event_multi[index];
                var b =res_data.event_list;
                // console.log(isEquivalent(a,b));
                // if(!isEquivalent(event_multi[index],res_data.event_list)){
                    event_multi[index]=res_data.event_list;
                // }
                setDeskflame(0,23);
                setDeskRowContent(event_multi, index);
                get_events_by_date(date_short, index+1);
            }
        }
    };
    xhr.send();
}