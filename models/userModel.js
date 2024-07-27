import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
const { Schema } = mongoose;

const userSchema = new Schema({
  role: {
    type: String,
    required: [true, "Role harus diisi"],
    enum: ["customer", "owner"],
    default: "customer",
  },
  name: {
    type: String,
    required: [true, "Name harus diisi"],
    unique: [true, "Username sudah digunakan"],
  },
  email: {
    type: String,
    required: [true, "Email harus diisi"],
    unique: [true, "Email sudah digunakan"],
    validate: {
      validator: validator.isEmail,
      message: "Format email harus youremail@gmail.com",
    },
  },
  password: {
    type: String,
    required: [true, "Password harus diisi"],
    minLength: [6, "Password minimal 6 karakter"],
  },
  confirmPassword: {
    type: String,
    required: [false, "Konfirmasi password harus diisi"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Konfirmasi password tidak cocok dengan password",
    },
  },
  phone: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    default: "",
    enum: ["Male", "Female"],
  },
  city: {
    type: String,
    default: "",
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.comparePassword = async function (reqBody) {
  return await bcrypt.compare(reqBody, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
