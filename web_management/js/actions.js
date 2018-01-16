var server_address = '127.0.0.1';
var server_http = 'http';

var semester_list = [];

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