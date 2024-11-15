import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false
  },
  
  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    unique: false
  },

  projectName: {
    type: String,
    default: null
  },

  authType: {
    type: String,
    required: true
  },

  projectURL: {
    type: String,
    default: null
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;