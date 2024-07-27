import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../middlewares/asyncHandler.js";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "6d",
  });
};

const createSendResToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const isDev = process.env.NODE_ENV === "development" ? false : true;

  const cookieOptions = {
    expire: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    security: isDev,
  };

  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    data: user,
  });
};

export const registerUser = asyncHandler(async (req, res) => {
  const isOwner = (await User.countDocuments()) === 0;
  const role = isOwner ? "owner" : "customer";
  const { name, email, password, confirmPassword, phone } = req.body;

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error("Password and Confirm Password do not match");
  }
  const createUser = await User.create({
    role: role,
    name: name,
    email: email,
    phone: phone,
    password: password,
  });

  createSendResToken(createUser, 201, res);
});

export const loginUser = asyncHandler(async (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400);
    throw new Error("Email/Password tidak boleh Kosong");
  }

  const userData = await User.findOne({ email: req.body.email });
  
  if (userData && (await userData.comparePassword(req.body.password))) {
    createSendResToken(userData, 200, res)
  }else{
    res.status(400);
    throw new Error("Invalid User");
  }
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (user) {
    return res.status(200).json({
      user
    })
  } else {
    res.status(404);
    throw new Error("User not found");
  }
})

export const logoutUser = async (req, res) => {
  res.cookie('jwt', "", {
    httpOnly: true,
    expires: new Date(Date.now())
  })

  res.status(200).json({
    message: "Logout Success"
  })
}

export const AllUser = asyncHandler(async (req, res) => {
  const user = await User.find();

  let countUser = await User.countDocuments();

  return res.status(200).json({
    data: user,
    message: "Berhasil tampil semua User",
    count: countUser
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const paramId = req.params.id;
  await User.findByIdAndDelete(paramId);

  return res.status(200).json({
    message: "Berhasil delete User",
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const paramId = req.params.id;

  const updateUser = await User.findByIdAndUpdate(paramId, req.body, {
    runValidators: false,
    new: true,
  });

  return res.status(201).json({
    message: "Berhasil update user",
    data: updateUser,
  });
});

