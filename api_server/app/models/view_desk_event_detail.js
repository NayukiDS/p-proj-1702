var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var View_desk_event = new Schema({
    // _id: String,
    bind_class: String,
    pre_desk: String,
    course: [{ type:String }],
    name: String,
    event_docs: [{ type: Schema.Types.Mixed }],
    professor_docs: [{ type: Schema.Types.Mixed }]
});

module.exports = mongoose.model('view_desk_event_detail',View_desk_event);