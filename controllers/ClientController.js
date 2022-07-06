const { ProfilePsikolog, SchedulePsikolog, CustomerBooking } = require("../models");
const { Op } = require("sequelize");

class Controller {
    static async allCustBooking(req, res, next) {
        const UserId = req.user.id;
        try {
            const allCustBooking = await CustomerBooking.findAndCountAll({
                where: { UserId },
                attributes: ["id", "UserId", "ScheduleId", "linkMeet", "paymentStatus", "statusBooking"],
            });

            if (!allCustBooking) throw { name: "NotFound", message: "customer booking is nothing found" };

            res.status(200).json({
                status: true,
                data: allCustBooking,
            });
        } catch (error) {
            next(error);
        }
    }

    static async detailsCustBooking(req, res, next) {
        try {
            let option = {
                where: { [Op.and]: [{ id: req.params.custBookingId }, { UserId: req.user.id }] },
                attributes: ["id", "UserId", "ScheduleId", "linkMeet", "paymentStatus", "statusBooking"],
                include: [
                    {
                        model: SchedulePsikolog,
                        attributes: ["id", "PsikologId", "day", "time", "price"],
                        include: [
                            {
                                model: ProfilePsikolog,
                                attributes: ["id", "fullname", "imageUrl", "description", "rating"],
                            },
                        ],
                    },
                ],
            };

            const detailsCustBooking = await CustomerBooking.findOne(option);
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
