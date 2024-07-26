import mongoose from "mongoose";
const { Schema } = mongoose;

const singleProduct = Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
});

const orderSchema = new Schema({
  total: {
    type: Number,
    required: [true, "Total harga harus diisi"],
  },
  itemsDetail: [singleProduct],
  user: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "failed", "success"],
    default: "pending",
  },
  firstname: {
    type: String,
    required: [true, "Nama Depan harus diisi"],
  },
  lastname: {
    type: String,
    required: [true, "Nama Belakang harus diisi"],
  },
  phone: {
    type: String,
    required: [true, "Nomor Telepon harus diisi"],
  },
  email: {
    type: String,
    required: [true, "Email harus diisi"],
  },
  city: {
    type: String,
    required: [true, "Kota harus diisi"],
  },
  address: {
    type: String,
    required: [true, "Alamat harus diisi"],
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
