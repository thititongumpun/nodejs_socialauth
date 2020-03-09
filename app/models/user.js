const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const userSchema = mongoose.Schema({
    local: {
        email: String,
        password: String
    },
    facebook: {
        id: String,
        token: String,
        name: String,
        email: String
    }
})

//generate hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}

//compare password
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password)
}

module.exports = mongoose.model('User', userSchema)