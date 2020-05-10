const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

userSchema.pre('save', function (next) {
    const user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err)
                return next('There was an error during the salt generation');

            bcrypt.hash(user.password, salt, function (error, hash) {
                if (error)
                    return next('There was en error during the hashing procedure');

                user.password = hash;
                return next();
            })
        })
    } else {
        console.log('The password wasnt modified since the last save');
        return next();
    }
});

userSchema.methods.comparePasswords = function (password, next) {
    bcrypt.compare(password, this.password, function (error, isMatch) {
        return next(error, isMatch);
    })
}


mongoose.model('user', userSchema);