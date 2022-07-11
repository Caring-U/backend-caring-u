const router = require("express").Router();
const Controller = require("../controllers/ClientController");
const { authentication, authorizeClientOwner } = require("../middlewares/auth");

router.get("/", authentication, Controller.allCustBooking); // berhasil
router.post("/booking", authentication, Controller.booking);
router.get("/:custBookingId", authentication, authorizeClientOwner, Controller.detailsCustBooking); // berhasil

module.exports = router;
