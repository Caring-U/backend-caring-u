// const Controller = require("../controllers/ClientController");

const router = require("express").Router();
const { allCustBooking, detailsCustBooking } = require("../controllers/ClientController");

router.get("/", allCustBooking);
router.get("/:userId", detailsCustBooking);

module.exports = router;
