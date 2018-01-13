var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    _id: { type: String, default: mongoose.Types.ObjectId().toString() },
    pre_comment: { type: String },
    user_id: { type: String, ref: 'user' },
    event_id: { type: String, ref: 'course' },
    add_ts: { type: Date, default: Date.now },
    focus: { type: Boolean, default: false },
    available: { type: Boolean, default: false },
    content: { type: String }
});

module.exports = mongoose.model('remark', CommentSchema);