var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    wechat_id: String,
    wechat_avatar: { type: String },
    bind_id: String,
    name: { type: String, default: "未命名用户" },
    admin: { type: Boolean, default: false },
    admin_pd: String,
    authentic: { type: Boolean, default: false },
    class_id: { type: String, ref: 'class' },
    desks: [{ type: String, ref:'desk' }],
    info: {type: Schema.Types.Mixed}//JSON string
});

module.exports = mongoose.model('user', UserSchema);