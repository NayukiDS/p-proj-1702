var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
    _id: { type: String },
    name: { type: String, default: '未命名事件' },
    semester: { type: Number },
    creator_id: { type: String, ref: 'user' },
    private: { type:Boolean, default: true },
    schedule: [{ type: Schema.Types.Mixed }],//JSON string
    content: { type: String }
});

// module.exports = mongoose.model('course', CourseSchema);
module.exports = mongoose.model('event', EventSchema);