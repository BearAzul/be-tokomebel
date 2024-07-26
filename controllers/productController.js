import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

export const CreateProduct = asyncHandler(async (req, res) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    message: "Product created successfully",
    data: newProduct,
  });
});

export const AllProduct = asyncHandler(async (req, res) => {
  // Req Query
  const queryObj = { ...req.query };

  // fungsi untuk mengabaikan jika ada req page
  const excludeField = ["page", "limit", "name"];
  excludeField.forEach((element) => delete queryObj[element]);

  let query;

  if (req.query.name) {
    query = Product.find({
      name: { $regex: req.query.name, $options: "i" },
    });
  } else {
    query = Product.find(queryObj);
  }

  // Pagination
  const page = req.query.page * 1 || 1;
  const limitData = req.query.limit * 1 || 30;
  const skipData = (page - 1) * limitData;

  query = query.skip(skipData).limit(limitData);

  let countProduct = await Product.countDocuments();

  if (req.query.page) {
    if (skipData >= countProduct) {
      res.status(404);
      throw new Error("This page doesn't exist");
    }
  }

  const data = await query;

  return res.status(200).json({
    message: "Berhasil tampil semua product",
    data,
    count: countProduct,
  });
});

export const detailProduct = asyncHandler(async (req, res) => {
  const paramsId = req.params.id;
  const productData = await Product.findById(paramsId);

  if (!productData) {
    res.status(404);
    throw new Error("Product not found");
  }

  return res.status(200).json({
    message: "Berhasil tampil detail product",
    data: productData,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const paramId = req.params.id;

  const updateProduct = await Product.findByIdAndUpdate(paramId, req.body, {
    runValidators: false,
    new: true,
  });

  return res.status(201).json({
    message: "Berhasil update product",
    data: updateProduct,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const paramId = req.params.id;
  await Product.findByIdAndDelete(paramId);

  return res.status(200).json({
    message: "Berhasil delete product",
  });
});

export const Fileupload = asyncHandler(async (req, res) => {
  const stream = cloudinary.uploader.upload_stream(
    {
      folder: "uploads",
      allowed_formats: ["jpg", "png"],
    },
    function (err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Gagal upload gambar",
          error: err,
        });
      }
      res.json({
        message: "Berhasil upload gambar",
        url: result.secure_url,
      })
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(stream)
});
