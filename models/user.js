let mongoose = require('mongoose');

Schema = mongoose.Schema;

let UserSchema = new mongoose.Schema({
        name: {type:String,unique:true},
        pass: String
    },
    { collection: 'Users' });

module.exports = mongoose.model('users', UserSchema)
