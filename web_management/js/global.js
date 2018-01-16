function panel_toggle() {
    var desk_obj = $('#desk');
    if(desk_obj.hasClass('left_container_full')){
        desk_obj.removeClass('left_container_full');
        desk_obj.addClass('left_container_half');
    }else{
        desk_obj.removeClass('left_container_half');
        desk_obj.addClass('left_container_full');
    }
}

function animation_blink_hide(obj, autohide) {
    var color_o = obj.css('color');
    obj.css('display','block');
    obj.animate({
        opacity: '1'
    },50, function () {
        obj.animate({
            opacity: '0'
        },50, function () {
            obj.animate({
                opacity: '1'
                // color: 'white'
            },50, function () {
                obj.animate({
                    opacity: '0'
                },50, function () {
                    obj.animate({
                        opacity: '1',
                        color: color_o
                    },50, function () {
                        if(autohide===true){
                            setTimeout(function () {
                                obj.animate({
                                    opacity: '0'
                                },200);
                                setTimeout(function () {
                                    obj.css('display','none');
                                },200);
                            },3000)
                        }
                    })
                })
            })
        })
    })
}

function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}

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

function mtime_hour_float_convert(hour) {
    var mtime;
    if(typeof (hour)==='string'||!hour&&hour!==0){
        mtime = parseInt(hour);
    }else{
        return false;
    }
    mtime = parseInt(mtime/100) + ((mtime%100)/60);
    return mtime;

}