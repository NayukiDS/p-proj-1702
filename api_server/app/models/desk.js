var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeskSchema = new Schema({
    _id: { type: String, default: mongoose.Types.ObjectId().toString() },
    name: { type: String, default: '未命名桌面' },
    bind_class: { type: String, ref: 'class' },
    courses: [{ type: String, ref: 'course' }]
});

module.exports = mongoose.model('desk', DeskSchema);