const mongoose = require('mongoose')

const validator = require('validator');
const bcrypt = require('bcrypt')

const {ServerConfig} = require('../config')

const notEmpty = (value) => {
    return value && value.trim().length > 0;
};



const userSchema = new mongoose.Schema({

    username : {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        maxLength: [60, 'Username cannot exceed 60 characters'],
        validate: {
            validator: notEmpty,
            message: 'Username is empty'
        }
    },
    password : {
        type: String,
        required: [true, 'Password is required'],
        maxLength: [60, 'Password cannot exceed 60 characters'],
        validate: {
            validator: notEmpty,
            message: 'Password is empty'
        }
    },
    email : {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: [
            {
                validator: notEmpty,
                message: 'Email is empty'
            },
            {
                validator: validator.isEmail,
                message: 'Invalid email'
            }
        ]
       

    },
    createdAt : {
        type : Date,
        required:true,
        default : Date.now()
    },
    updatedAt : {
        type : Date,
        required:true,
        default : Date.now()
    }


});

userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const saltRounds = parseInt(ServerConfig.SALT_ROUND, 10);
            this.password = await bcrypt.hash(this.password, saltRounds);
            next();
        } catch (err) {
            next(err);
        }
    } else {
        return next();
    }
});


module.exports = mongoose.model("UserRegistaration",userSchema)

