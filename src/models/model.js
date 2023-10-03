import mongoose from "mongoose";

// Define User Schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  googleId: {
    required: false,
    type: String,
  },
  githubId: {
    required: false,
    type: String,
  },
});

// Create MongoDB models based on the schemas
const User = mongoose.model("User", userSchema);

export { User };
