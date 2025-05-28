const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      trim: true,
    },
    // Password reset fields - make them optional and don't set default: undefined
    passwordResetToken: {
      type: String,
      sparse: true, // This allows multiple documents to have null/undefined values
    },
    passwordResetExpires: {
      type: Date,
      sparse: true, // This allows multiple documents to have null/undefined values
    },
  },
  {
    timestamps: true,
    // This helps with validation issues
    strict: false,
  }
);

// Remove the problematic index - we'll add it differently
// userSchema.index({ passwordResetExpires: 1 }, { expireAfterSeconds: 0 });

// Add a proper index for password reset cleanup
userSchema.index(
  { passwordResetExpires: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: { passwordResetExpires: { $exists: true } },
  }
);

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  return user;
};

module.exports = mongoose.model("User", userSchema);
