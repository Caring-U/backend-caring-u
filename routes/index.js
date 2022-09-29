const router = require("express").Router();
const psiokologRouter = require("./psikologRouter.js");
const clientRouter = require("./clientRouter.js");
const adminRouter = require("./adminRouter.js");

const HomeController = require("../controllers/HomeController.js");
const userRouter = require("./userRouter.js");

//untuk halaman utama
router.get("/list-psikolog", HomeController.getAllPsikolog); // berhasil
router.get("/list-psikolog/:ProfilePsikologId", HomeController.detailProfilePsikolog); // berhasil

//handling auto notifikasi
router.post("/notifikasi-midtrans", HomeController.updatePaymentStatus);

//untuk dashboard psikolog (setelah login)
router.use("/psikolog", psiokologRouter); // berhasil

router.use("/admin", adminRouter);

// untuk dashboard client
router.use("/client", clientRouter);

//untuk auth
router.use("/users", userRouter);

module.exports = router;
