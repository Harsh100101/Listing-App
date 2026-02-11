const express = require("express");
const router = express.Router();
const listings = require("../store/listings");

router.get("/", (req, res) => {
	res.send(listings);
});

// Accept new listings (basic, no file/image handling)
router.post("/", (req, res) => {
	res.status(201).send({ message: "Listing received!" });
});

module.exports = router;
