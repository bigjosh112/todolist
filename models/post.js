const mongoose = require ('mongoose');

const postSchema = mongoose.Schema(
    {
        title:{type: String, require: true},
        tasks: {type: String},
        description: String,
        timestamp: Date,
        edited: {type: Boolean, default: false},
        edited_at: Date,
        
         stats: {
            post_count: { type: Number, default: 0 }
         }
    },
    { collection: 'posts'}

);

const model = mongoose.model('Post', postSchema);

module.exports = model;