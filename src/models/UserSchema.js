import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Insert a user'],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Insert an email'],
  },
  password: {
    type: String,
    required: [true, 'Insert an password']
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'publisher'],
    default: 'user'
  },
  icon: {
    type: String,
    default: 'https://gamepedia.cursecdn.com/pathologic_gamepedia/9/91/Tragediantrade.png?version=808516dbd2e46ed5ecb4d809c2bb0970'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Encrypt password before save
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next()
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

export default mongoose.model('User', UserSchema)
