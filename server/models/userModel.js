import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    image: { type: String }
})

const UserModel = mongoose.model('luneX-logins', UserSchema)
export default UserModel