const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const mongoose = require('mongoose');




// Create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {

  let {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    user
  } = req.body;
  
    try {

          const order1 = await Order.find({'paymentInfo.id' : req.body.paymentInfo.id});
          console.log(order1);
          if(order1.length != 0)
          {
      
                res.status(400).send("order already exists with this paymentid");
      
          }
          else
          {

              const order = await Order.create({
              shippingInfo,
              orderItems,
              paymentInfo,
              itemsPrice,
              taxPrice,
              shippingPrice,
              totalPrice,
              paidAt: Date.now(),
              user
          });
              async function updateStock(id, quantity) {
              const product = await Product.findById(id);
              product.stock -= quantity;
              await product.save({ validateBeforeSave: false });
            }
              order.orderItems.forEach(async (o) => {
              await updateStock(o.productId, o.quantity);
            });
      
            res.status(201).json({
            success: true,
            order,
           });
       }    
    } catch (error) {
          console.log(error)
          return next(new ErrorHander("Internal Server Error", 500));
    }
 
});

// get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
 
  const order = await Order.findById(req.params.id)

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }


  res.status(200).json({
    success: true,
    order,
  });
});


// get logged in user  Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// get all Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// update Order Status -- Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHander("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.Stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

// delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});