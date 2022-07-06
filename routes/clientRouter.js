const router = require("express").Router();
const { allCustBooking, detailsCustBooking } = require("../controllers/ClientController");
const { authentication, authorizeClientOwner } = require("../middlewares/auth");

router.get("/", authentication, allCustBooking);
router.get("/:custBookingId", authentication, authorizeClientOwner, detailsCustBooking);

module.exports = router;
