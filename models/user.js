const mongoose = require ('mongoose');

const userSchema = mongoose.Schema(
    {
        name: {type: String, unique: true, require: true},
        email:{type: String, unique: true, require: true},
        password:{type: String, unique: true, require: true},
        username:{type: String, unique: true},
    
         stats: {
            post_count: { type: Number, default: 0 }
         }
    },
    { collection: 'users'}

);

const model = mongoose.model('User', userSchema);

module.exports = model;