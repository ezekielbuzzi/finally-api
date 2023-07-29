const express = require("express");
const {
  signup,
  signin,
  getAllUsers,
  getUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", (req, res) => {
  res.send({ message: "The finally server is up!" });
});
router.post("/api/signup", signup);
router.post("/api/signin", signin);
router.get("/api/all", getAllUsers);
router.get("/api/one/:id", getUser);

module.exports = router;
