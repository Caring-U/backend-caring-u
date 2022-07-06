const { User, ProfilePsikolog, SchedulePsikolog, CustomerBooking } = require("../models");

class Controller {
    static async allCustBooking(req, res, next) {
        const UserId = req.user.id;
        try {
            const allCustBooking = await CustomerBooking.findAndCountAll({
                where: { UserId },
                attributes: ["UserId", "ScheduleId", "linkMeet", "paymentStatus", "statusBooking"],
            });

            if (!allCustBooking) throw { name: "userNotFound", message: "customer booking is nothing found" };

            res.status(200).json({
                status: true,
                data: allCustBooking,
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static async detailsCustBooking(req, res, next) {
        // const userId = req.user.id
        console.log(req.params.userId);
        try {
            let option = {
                where: { id: req.params.userId },
                attributes: ["username", "email"],
                include: [
                    {
                        model: CustomerBooking,
                        attributes: ["UserId", "ScheduleId", "linkMeet", "paymentStatus", "statusBooking"],
                        include: [
                            {
                                model: SchedulePsikolog,
                                attributes: ["PsikologId", "day", "time", "price"],
                                include: [
                                    {
                                        model: ProfilePsikolog,
                                        attributes: ["fullname", "imageUrl", "description", "rating"],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            };

            const detailsCustBooking = await User.findOne(option);
            if (!detailsCustBooking) throw { name: "userNotFound", message: "customer booking is nothing found" };

            res.status(200).json({
                status: true,
                data: detailsCustBooking,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = Controller;
