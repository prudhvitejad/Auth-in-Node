const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true, //required: [true,'Please enter an email']
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true, //required: [true,'Please enter an email']
        minLength: 6 //minLength: [6,'Minimum password length is 6 characters']
    }
})

//fire a function after doc is saved to db
userSchema.post('save', (doc,next) => {
    console.log('new user was created & saved',doc);
    next();
})

//fire a function before doc saved to db
userSchema.pre('save', async function (next) {
    try {
        console.log('user about to be created & saved',this);

        //generate a salt first to hash our passwords
        const salt = await bcrypt.genSalt(10);
        console.log("salt = ",salt);
        const hashedPassword = await bcrypt.hash(this.password,salt);
        this.password = hashedPassword;

        console.log('user about to be created & saved after hasing password',this);
        next();
    } catch(err) {
        next(err);
    }
})

userSchema.methods.isValidPassword = async function(password) {
    try {
        return await bcrypt.compare(password,this.password);
    }
    catch(err) {
        next(err);
    }
}

const User = mongoose.model('users', userSchema);

module.exports = User;