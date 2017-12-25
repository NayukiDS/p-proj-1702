function ScheduleJSON() {
    this.type = null; //class lab lecture practical seminar
    this.day = null; //mo tu we th fr sa su
    this.week = null; //{1,2,4,8,16...}
    this.time = {start: null, end: null};
    this.location = null;
    this.instructor_id = null;
    var that = this;
    this.exportJSON = function () {
        var json_obj = {
            type: that.type,
            day: that.day,
            week: that.week,
            time: that.time,
            location: that.location,
            instructor_id: that.instructor_id
        };
        return json_obj;
    }
}

module.exports = ScheduleJSON;