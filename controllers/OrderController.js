import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";

export const CreateOrder = asyncHandler(async (req, res) => {
  const { firstname, lastname, phone, email, address, city, cartItem } =
    req.body;
  if (!cartItem || cartItem.length < 1) {
    res.status(400);
    throw new Error("Keranjang anda masih kosong");
  }
  let orderItem = [];
  let total = 0;
  for (const cart of cartItem) {
    const productData = await Product.findOne({ _id: cart.product });

    if (!productData) {
      res.status(404);
      throw new Error("ID Product tidak ditemukan");
    }

    const { name, price, category, _id } = productData;
    const singleProduct = {
      quantity: cart.quantity,
      name,
      price,
      category,
      product: _id,
    };

    orderItem = [...orderItem, singleProduct];

    total += cart.quantity * price;
  }

  const order = await Order.create({
    itemsDetail: orderItem,
    total,
    firstname,
    lastname,
    phone,
    email,
    city,
    address,
    user: req.user.id
  })

  return res.status(200).json({
    total,
    order,
    message: "Berhasil buat order product",
  });
});

export const AllOrder = asyncHandler(async (req, res) => {
  const order = await Order.find()

  return res.status(200).json({
    data: order,
    message: "Berhasil tampil semua order",
  })
});

export const DetailOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  return res.status(200).json({
    data: order,
    message: "Berhasil tampil detail order",
  })
});

export const UpdateOrder = asyncHandler(async (req, res) => {
  const paramId = req.params.id;

  const updateOrder = await Product.findByIdAndUpdate(paramId, req.body, {
    runValidators: false,
    new: true,
  });

  return res.status(201).json({
    message: "Berhasil update Order product",
    data: updateOrder,
  });
});

export const DeleteOrder = asyncHandler(async (req, res) => {
  const paramId = req.params.id;
  await Order.findByIdAndDelete(paramId);

  return res.status(200).json({
    message: "Berhasil delete Order Product",
  });
});

export const CurrentUserOrder = asyncHandler(async (req, res) => {
  const order = await Order.find({
  'user': req.user.id
  })
  
  return res.status(200).json({
    data: order,
    message: "Berhasil tampil current user order",
  })
});
