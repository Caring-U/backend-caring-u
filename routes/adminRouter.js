const AdminController = require("../controllers/AdminController");
const { authentication, authorizeAdmin } = require("../middlewares/auth");

const router = require("express").Router();

router.get("/list-psikolog", authentication, AdminController.getAllPSikologStatus)
router.patch("/list-psikolog/:PsikologId", authentication, authorizeAdmin, AdminController.updateStatusPsikolog)

module.exports = router
