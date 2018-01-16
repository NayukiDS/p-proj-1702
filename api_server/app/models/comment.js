var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    // _id: { type: String, default: mongoose.Types.ObjectId().toString() },
    pre_comment: { type: String },
    // user_id: { type: String, ref: 'user' },
    user_id: { type: String },
    event_id: { type: String, ref: 'course' },
    add_ts: { type: Number, default: Date.now },
    focus: { type: Boolean, default: false },
    available: { type: Boolean, default: true },
    content: { type: String }
},{toObject : {virtuals:true}},{toJSON : {virtuals : true}});

var UserSchema = new Schema({
    wechat_id: String,
    bind_id: String,
    name: { type: String, default: "未命名用户" },
    admin: { type: Boolean, default: false },
    admin_pd: String,
    authentic: { type: Boolean, default: false },
    class_id: { type: String, ref: 'class' },
    desks: [{ type: String, ref:'desk' }],
    info: {type: Schema.Types.Mixed}//JSON string
},{toObject : {virtuals:true}},{toJSON : {virtuals : true}});

var User = mongoose.model('User', UserSchema);

CommentSchema.virtual('user_detail',{
    ref: 'User',
    localField: 'user_id',
    foreignField: 'bind_id'
});

module.exports = mongoose.model('comment', CommentSchema);