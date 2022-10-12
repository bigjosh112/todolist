const mongoose = require ('mongoose');

const postSchema = mongoose.Schema(
    {
        title:{type: String, require: true},
        user_id: String,
        task: {type: String},
        description: String,
        timestamp: Date,
        edited: {type: Boolean, default: false},
        edited_at: Date,
        completed: {default: false},
        completed_at: Date,
        
         stats: {
            post_count: { type: Number, default: 0 }
         }
    },
    { collection: 'posts'}

);

const model = mongoose.model('Post', postSchema);

module.exports = model;