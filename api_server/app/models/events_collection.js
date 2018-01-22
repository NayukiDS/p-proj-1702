var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventCollectionSchema = new Schema({
    _id: { type: String },
    name: { type: String },
    professor_id: { type: String },
    creator_id: { type: String },
    e_course: {type: Boolean },
    private: { type: Boolean },
    semester: { type: Number },
    schedule: [{ type: Schema.Types.Mixed }]//JSON string
});

module.exports = mongoose.model('event', EventCollectionSchema);