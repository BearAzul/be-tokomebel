import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Nama product harus diisi"],
    unique: [true, "Nama product sudah digunakan"],
  },
  price: {
    type: Number,
    required: [true, "Harga product harus diisi"],
  },
  summary: {
    type: String,
    required: [true, "Deskripsi singkat harus diisi"],
  },
  description: {
    type: String,
    required: [true, "Deskripsi product harus diisi"],
  },
  image: {
    type: String,
    default: null,
  },
  category: {
    type: String,
    required: [true, "Category product harus diisi"],
    enum: ["Bed", "Chair", "Wardrobe", "Sofa", "Lamps", "Table"],
  },
  stock: {
    type: Number,
    default: 0
  }
});

const Product = mongoose.model("Product", productSchema);

export default Product;
