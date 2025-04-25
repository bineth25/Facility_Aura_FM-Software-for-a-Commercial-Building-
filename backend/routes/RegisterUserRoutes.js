const express = require("express");
const { RegisterUserInsert } = require("../Controllers/RegisterUserController");

const router = express.Router();

// RegisterUser insertion
router.post("/RegisterUserInsertion", RegisterUserInsert);

module.exports = router;
