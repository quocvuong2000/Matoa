const Category = require("../models/Category");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndStaff,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE
router.post("/", verifyTokenAndStaff, async (req, res) => {
  const newCategory = new Category(req.body);

  try {
    const savedCategory = await newCategory.save();
    res.status(200).json(savedCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
