const mongoose = require('mongoose');
const validator = require('validator');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');

const customerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First Name is required'],
        minlength: [2, 'First Name must be at least 2 characters'],
        maxlength: [50, 'First Name must be less than 50 characters'],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z]+$/.test(v); 
            },
            message: props => `${props.value} is not a valid First Name`
        }
    },
    lastName: {
        type: String,
        required: [true, 'Last Name is required'],
        minlength: [2, 'Last Name must be at least 2 characters'],
        maxlength: [50, 'Last Name must be less than 50 characters'],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z]+$/.test(v); // Letters only (no numbers or special characters)
            },
            message: props => `${props.value} is not a valid Last Name`
        }
    },
    phoneNumber: {
        type: Number, 
        required: [true, 'Phone Number is required'],
        validate: {
            validator: function (v) {
                return v.toString().length >= 10 && v.toString().length <= 15; // Accept only 10-15 digits
            },
            message: props => `${props.value} is not a valid phone number`
        }
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        minlength: [5, 'Address must be at least 5 characters'],
        maxlength: [100, 'Address must be less than 100 characters'],
    },
    zipCode: {
        type: Number, 
        required: [true, 'Zip Code is required'],
        validate: {
            validator: function (v) {
                return v.toString().length === 4; // Accept only 4 digits
            },
            message: props => `${props.value} is not a valid zip code`
        }
    },
    profileImage: {
        public_id: {
            type: String,
            required: [true, 'Profile image public ID is required']
        },
        url: {
            type: String,
            required: [true, 'Profile image URL is required'],
            validate: {
                validator: function (v) {
                    return validator.isURL(v);
                },
                message: props => `${props.value} is not a valid URL`
            }
        }
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    fcmToken: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model("Customer", customerSchema);
