var date_multi = [];

function date_multi_choice(year, month, date, static_mode){
    if(static_mode===undefined) static_mode = false;
    var ds = new Date_obj_short(year, month ,date);
    var repeat = false;
    var repeat_index = -1;
    var add_bool = false;
    for(var i=0;i<date_multi.length;i++) {
        if(ds.equalOBJ(date_multi[i])){
            repeat = true;
            repeat_index = i;
        }
    }
    if(repeat){
        date_multi.splice(repeat_index,1);
        add_bool = false;
    }else{
        date_multi.push(ds);
        add_bool = true;
    }
    if(static_mode){
        var s_year = parseInt($('#panel_picker_year').html());
        var s_month = parseInt($('#panel_picker_month').html());
        calendar_init(undefined, s_year, s_month);
    }else{
        calendar_init(Date.parse(year+"-"+month+"-"+date), undefined, undefined);
    }
    return add_bool;
}

function calendar_init(init_ts, year, month) {
    var date = null;
    if(!init_ts){
        date = new Date;
    }
    else{
        date = new Date(init_ts);
    }
    if(typeof(year)==='number'&&typeof(month)==='number'){
        if(month>12){
            year += 1;
            month -= 12;
        }else if(month<1){
            year -= 1;
            month += 12;
        }
        date = Date.parse(year+"-"+month+"-1");
        date = new Date(date);
    }
    var c_year, c_month, c_date;
    var today_date, today_month, today_year;
    var p_year, p_month;
    var a_year, a_month;

    var date_init = Date.parse(date.getFullYear()+"-"+(date.getMonth()+1)+"-1");
    date_init = new Date(date_init - 86400000);
    var pre_day = date_init.getDate();
    var p_wday = convert_wday(date_init.getDay());
    p_year = date_init.getFullYear();
    p_month = date_init.getMonth()+1;

    if(date.getMonth()+2===13){
        date_init = Date.parse((date.getFullYear()+1)+"-1-1");
    }else{
        date_init = Date.parse(date.getFullYear()+"-"+(date.getMonth()+2)+"-1");
    }
    date_init = new Date(date_init);
    a_year = date_init.getFullYear();
    a_month = date_init.getMonth()+1;

    if(date.getMonth()+2===13){
        date_init = Date.parse((date.getFullYear()+1)+"-1-1");
    }else{
        date_init = Date.parse(date.getFullYear()+"-"+(date.getMonth()+2)+"-1");
    }
    date_init = new Date(date_init - 86400000);
    var end_day = date_init.getDate();

    date_init = Date.parse(date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate());
    date_init = new Date(date_init);
    c_year = date_init.getFullYear();
    c_month = date_init.getMonth()+1;
    c_date = date_init.getDate();

    date_init = new Date;
    today_date = date_init.getDate();
    today_month = date_init.getMonth() + 1;
    today_year = date_init.getFullYear();

    $('#panel_picker_year').html(c_year);
    $('#panel_picker_month').html(c_month+"月");

    var date_array = [];
    var date_obj;
    var sweek = 1;

    var i;
    if(p_wday!==6){
        for(i=p_wday;i>=0;i--){
            date_obj = new Date_obj(p_year, p_month, pre_day, undefined, undefined, false);
            date_array.unshift(date_obj.exportOBJ());
            pre_day--;
        }
    }

    i = 1;
    while(i<=end_day){
        date_obj = new Date_obj(c_year, c_month, i, undefined, undefined, true);
        date_array.push(date_obj.exportOBJ());
        i++;
    }

    i = 1;
    while(date_array.length<42){
        date_obj = new Date_obj(a_year, a_month, i, undefined, undefined, false);
        date_array.push(date_obj.exportOBJ());
        i++;
    }

    var week_container = $('#panel_picker_day').children();
    var index = 0;
    week_container.each(function (i_w, v_w) {
        if(i_w===0){return;}
        var day_container = $(v_w).children();
        day_container.each(function (i_d ,v_d) {
            if(i_d===0){
                $(v_d).attr("calendar_type", "row_head");
                return;
            }
            var date_obj = date_array[index];
            $(v_d).attr("calendar_type", "day");
            $(v_d).removeClass("day_highlight");
            $(v_d).removeClass("day_today");
            $(v_d).removeClass("day_current");
            $(v_d).html(date_obj.s_date);
            $(v_d).attr("s_year", date_obj.s_year);
            $(v_d).attr("s_month", date_obj.s_month);
            $(v_d).attr("s_date", date_obj.s_date);
            $(v_d).attr("s_wday", i_d);
            $(v_d).attr("s_sweek", date_obj.s_sweek);
            if(date_obj.s_highlight){
                $(v_d).addClass("day_highlight");
            }
            if(date_obj.s_year===today_year&&date_obj.s_month===today_month&&date_obj.s_date===today_date){
                $(v_d).addClass("day_today");
            }
            // if(date_obj.s_year===c_year&&date_obj.s_month===c_month&&date_obj.s_date===c_date&&!view_mode){
            //     $(v_d).addClass("day_current");
            // }
            for(var i=0;i<date_multi.length;i++){
                if(date_multi[i].equalOBJ(date_obj)){
                    $(v_d).addClass("day_current");
                    break;
                }
            }
            index++;
       })
    });
}

function Date_obj_short(year, month, date){
    this.s_year = year;
    this.s_month = month;
    this.s_date = date;
    this.s_ts = Date.parse(this.s_year + "-" + this.s_month + "-" + this.s_date);
    var that = this;
    this.exportOBJ = function () {
        return{
            s_year: that.s_year,
            s_month: that.s_month,
            s_date: that.s_date,
            s_ts: that.s_ts
        }
    };
    this.equalOBJ = function (obj) {
        return obj.s_year==that.s_year&&obj.s_month==that.s_month&&obj.s_date==that.s_date;
    }
}

function Date_obj(year, month, date, wday, sweek, highlight){
    this.s_year = year;
    this.s_month = month;
    this.s_date = date;
    this.s_wday = wday;
    this.s_sweek = sweek;
    this.s_highlight = highlight;
    var that = this;
    this.exportOBJ = function () {
        return{
            s_year: that.s_year,
            s_month: that.s_month,
            s_date: that.s_date,
            s_wday: that.s_wday,
            s_sweek: that.s_sweek,
            s_highlight: that.s_highlight
        }
    }
}

function convert_wday(day) {
    if(!day&&day!==0)return false;
    if(day===0)day=7;
    day -= 1;
    return day;
}

function desk_load_select(){

}

function page_example(id, status) {
    //status: 0-return 1-next 2-current 3-other
    var page = $('#'+id+'');
    var animation_dur = 200;
    switch (status){
        case 0:
            page.animate({
                right: "20rem"
            },animation_dur);
            break;
        case 1:
            page.animate({
                right: "-20rem"
            },animation_dur);
            break;
        case 2:
            page.animate({
                right: "0"
            },animation_dur);
            break;
        case 3:
            page.animate({
                right: "-40rem"
            },animation_dur);
            break;
        default:
            return false;
    }
}

$(document).ready(function () {
    calendar_init();
    // calendar_init(1504630861000);
});