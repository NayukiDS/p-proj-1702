var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClassSchema = new Schema({
    _id: { type: String },
    college: { type: String },
    major: { type: String },
    year: { type: Number },
    name: { type: String, default: '未命名班级' },
    teacher_id: { type: String, ref: 'user' },
    desk_id: { type: String }
});

module.exports = mongoose.model('class', ClassSchema);