/**
 * Created by Francis on 10/17/2016.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    local :{
        email:String,
        password:String
    },
    facebook:{
        id:String,
        token:String,
        email:String,
        name:String
    },
    twitter:{
        id:String,
        token:String,
        displayName:String,
        username:String
    },
    google:{
        id:String,
        token:String,
        email:String,
        name:String,
        image:Object
    },
    spotify:{
        id:String,
        country:String,
        urls:Object,
        href:String,
        token:String,
        email:String,
        photo:String,
        display_name:String,
    },
    youtube:{
        id: String,
        token: String, 
        name: String
    }

});

userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9), null);
};

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);