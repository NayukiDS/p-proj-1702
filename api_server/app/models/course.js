var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CourseSchema = new Schema({
    _id: { type: String },
    name: { type: String, default: '未命名课程' },
    semester: { type: Number },
    professor_id: { type: String, ref: 'user' },
    student_r_id: { type: String, ref: 'user' },
    schedule: [{ type: Schema.Types.Mixed }]//JSON string
});

module.exports = mongoose.model('course', CourseSchema);