import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // ajoute createdAt et updatedAt automatiquement
});

// Enregistrement du modèle
const User = mongoose.model('User', userSchema);

export default User;
