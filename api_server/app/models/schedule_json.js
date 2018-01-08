function ScheduleJSON() {
    this.type = null; //class lab lecture practical seminar cancel
    this.day = null; //mo tu we th fr sa su
    this.week = null; //[1,2,4,8,16...]
    this.time = {start: null, end: null};
    this.location = null;
    //this.instructor_id = null;
    var that = this;
    this.setter = function (v_type, v_day, v_week, v_time, v_location) {
        that.type = v_type;
        that.day = v_day;
        that.week = v_week;
        that.time = v_time;
        that.location = v_location;
    };
    this.exportJSON = function () {
        return {
            type: that.type,
            day: that.day,
            week: that.week,
            time: that.time,
            location: that.location
        };
    }
}

module.exports = ScheduleJSON;