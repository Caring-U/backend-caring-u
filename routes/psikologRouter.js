const router = require("express").Router();
const Controller = require("../controllers/PsikologController.js");
const { authentication, authorizeOwnerPsikolog, checkFoundProfilePsikolog, checkProfilePsikolog } = require("../middlewares/auth");

router.get("/", authentication, Controller.getAllSchedule); 
router.get("/profile", authentication, Controller.profilePsikolog); 
router.post("/profile", authentication, checkFoundProfilePsikolog, Controller.createProfile); 
router.patch("/profile", authentication, Controller.patchProfile); // 1
router.post("/profile/schedule", authentication, checkProfilePsikolog, Controller.createSchedule); 
router.get("/:ScheduleId", authentication, authorizeOwnerPsikolog, Controller.detailSchedule); 
router.delete("/:ScheduleId", authentication, authorizeOwnerPsikolog, Controller.destroySchedule); // 2
router.put("/:ScheduleId", authentication, authorizeOwnerPsikolog,checkProfilePsikolog, Controller.updateSchedule); // 3

module.exports = router;