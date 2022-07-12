const router = require("express").Router();
const Controller = require("../controllers/PsikologController.js");
const { authentication, authorizeOwnerPsikolog, checkFoundProfilePsikolog, checkProfilePsikolog } = require("../middlewares/auth");

router.get("/", authentication, Controller.getAllSchedule); 
router.get("/profile", authentication, Controller.profilePsikolog); 
router.post("/profile", authentication, checkFoundProfilePsikolog, Controller.createProfile); 
router.patch("/profile", authentication, Controller.patchProfile);
router.post("/profile/schedule", authentication, checkProfilePsikolog, Controller.createSchedule); 
router.get("/:ScheduleId", authentication, authorizeOwnerPsikolog, Controller.detailSchedule); 

module.exports = router;