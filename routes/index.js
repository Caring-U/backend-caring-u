const router = require("express").Router();
const psiokologRouter = require("./psikologRouter.js");
const clientRouter = require("./clientRouter.js");

router.get("/", (req, res, next) => {
    res.status(200).json({
        status: true,
        message: "Hello Caring-U",
    });
});

router.use("/psiokolog", psiokologRouter);
router.use("/client", clientRouter);

module.exports = router;
