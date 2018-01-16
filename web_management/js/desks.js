$(document).ready(function () {
    get_semester_list();
    // calendar_init(1504630861000);
});

$(window).on('resize', function(){
    var desk_flame = $('.desk_flame');
    setDeskflame(desk_flame.attr("start_hour"),desk_flame.attr("end_hour"));
});

var date_multi = [];

function date_multi_choice(year, month, date, static_mode){
    if(static_mode===undefined) static_mode = false;
    var ds = new Date_obj_short(year, month ,date);
    var repeat = false;
    var repeat_index = -1;
    var add_bool = false;
    var add_max = false;
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
        if(date_multi.length===7){
            add_bool = false;
            add_max = true;
        }else{
            date_multi.push(ds);
            add_bool = true;
        }
    }
    if(!add_max){
        setDeskRow();
        get_events_by_date(date_multi, date_multi.length-1)
        // get_events_by_date_array();
    }
    if(static_mode){
        var s_year = parseInt($('#panel_picker_year').html());
        var s_month = parseInt($('#panel_picker_month').html());
        calendar_init(undefined, s_year, s_month);
    }else{
        calendar_init(Date.parse(year+"-"+month+"-"+date), undefined, undefined);
    }
    // return add_bool;
    return add_max;
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
            var date_obj = date_array[index];
            if(i_d===0){
                $(v_d).attr("calendar_type", "row_head");
                var row_week = date_sweek_convert(date_obj.s_year+"-"+date_obj.s_month+"-"+date_obj.s_date);
                // var row_week = date_sweek_convert(date_obj.exportFormatDate());
                $(v_d).html(row_week.week);
                return;
            }
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
    this.exportFormatDate = function () {
        var date_format = that.s_year + "-" + that.s_month + "-" + that.s_date;
        return date_format;
    };
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
    this.exportFormatDate = function () {
        var date_format = that.s_year + "-" + that.s_month + "-" + that.s_date;
        return date_format;
    };
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

function setDeskflame(start_h, end_h) {
    if(!start_h)start_h = 0;
    start_h = parseInt(start_h);
    if(!end_h)end_h = 23;
    end_h = parseInt(end_h);
    if(start_h<0||start_h>23)return false;
    if(end_h<0||end_h>23)return false;
    if(start_h>end_h||end_h<start_h)return false;
    var desk_flame = $('.desk_flame');
    // var canvas_w = $('#desk_flame_canvas').width();
    var canvas_h = $('#desk_flame_canvas').height();
    var hour_block = end_h - start_h + 1;
    var full_h = canvas_h / (hour_block / 24);
    desk_flame.css('height',full_h);
    var block_h = full_h / 24;
    var repos_top = start_h * block_h * -1;
    // desk_flame.css('top:', repos_top);
    desk_flame.animate({
        top: repos_top
    },100);
    desk_flame.attr("start_hour", start_h);
    desk_flame.attr("end_hour", end_h);
    desk_flame.attr("full_height", full_h);
    // console.log("c_h:"+canvas_h);
    // console.log("f_h:"+full_h);
    // console.log("repos_top:"+repos_top);

}

function setDeskRow() {
    var desk_flame = $('#desk_flame').children();
    var desk_flame_container = $('#desk_flame_container').children();
    for(var i=0;i<7;i++){
        if(!date_multi[i]){
            $(desk_flame[i]).css('width','0');
            $(desk_flame_container[i]).css('width','0');
        }else{
            $(desk_flame[i]).css('width','100%');
            $(desk_flame_container[i]).css('width','100%');
        }
    }
}

function setDeskRowContent(event_list, index) {
    var desk_flame_container = $('#desk_flame_container').children();
    if(!event_list[index])return false;
    var events = event_list[index];
    var desk_flame = $('.desk_flame');
    var full_h = parseInt(desk_flame.attr('full_height'));

    $(desk_flame_container[index]).html("");
    events.forEach( function (value, c_index) {
        console.log(c_index);
        console.log(value);
        $(desk_flame_container[index]).append(
            "<div class='event'>"+value.name+"</div>"
        );
        var value_time_start = mtime_hour_float_convert(value.time[0]);
        var value_time_end = mtime_hour_float_convert(value.time[1]);
        var event_dur = value_time_end - value_time_start;
        var create_obj = $(desk_flame_container[index]).children();

        var css_height = event_dur * (full_h / 24);
        var css_top = value_time_start * (full_h / 24);
        console.log(css_top);
        console.log(css_height);
        $(create_obj[c_index]).css('height', css_height);
        $(create_obj[c_index]).css('top', css_top);
    })
}