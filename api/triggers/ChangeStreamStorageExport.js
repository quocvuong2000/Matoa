const Product = require("../models/Product");
const Order = require("../models/Order");
const Storage = require("../models/Storage");
var mongoose = require("mongoose");
async function monitorStorageExport(client, timeInMs) {
  const collection = client.db("kibi").collection("orders");
  const pipeline = [
    {
      $match: {
        operationType: "update",
        "updateDescription.updatedFields.status": "COMPLETED",
      },
    },
  ];
  const changeStream = collection.watch(pipeline);

  changeStream.on("change", async (next) => {
    const orderFound = await Order.findById(next.documentKey._id);
    orderFound.products.forEach(async (el) => {
      if (mongoose.Types.ObjectId.isValid(el.productId)) {
        const oldQuantity = await Product.findById(el.productId);

        if (oldQuantity && oldQuantity.quantity > 0) {
          const newQuantity = oldQuantity.quantity - el.quantity;
          const newExport = {
            branchId: orderFound.branchId || "NA",
            productId: el.productId,
            newQuantity: newQuantity,
            oldQuantity: oldQuantity.quantity,
            branchName: orderFound.branchName || "NA",
            productName: el.product,
            status: "Export",
          };
          try {
            const savedStorage = new Storage(newExport);
            await savedStorage.save();
          } catch (error) {
            console.log(error);
          }
        }
      }
    });
  });

  // await closeChangeStream(timeInMs, changeStream);
}

module.exports = monitorStorageExport;
