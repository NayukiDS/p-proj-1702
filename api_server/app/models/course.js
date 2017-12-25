var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CourseSchema = new Schema({
    _id: String,
    name: String,
    schedule: JSON,
    p_student_id: [{ type: String, ref: 'user' }]
});

module.exports = mongoose.model('course', CourseSchema);