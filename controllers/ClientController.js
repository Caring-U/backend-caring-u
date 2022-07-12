const { ProfilePsikolog, SchedulePsikolog, CustomerBooking, sequelize } = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");

class Controller {
    static async allCustBooking(req, res, next) {
        // const UserId = req.user.id;
        try {
            // const allCustBooking = await CustomerBooking.findAndCountAll({
            //     where: { UserId },
            //     attributes: ["id", "UserId", "ScheduleId", "linkMeet", "paymentStatus"],
            //     order: [["id", "DESC"]],
            // });

            // if (!allCustBooking) throw { name: "NotFound", message: "customer booking is nothing found" };

            // res.status(200).json({
            //     status: true,
            //     data: allCustBooking,
            // });
            const result = await CustomerBooking.findAndCountAll({
                where : {
                    UserId : req.user.id
                },
                include: [{
                    model : SchedulePsikolog,
                    include : ProfilePsikolog
                }],
                offset: req.query.page || 0,
                limit: 4,
            })
            res.status(200).json(result)
        } catch (error) {
            next(error);
        }
    }

    static async detailsCustBooking(req, res, next) {
        try {
            let option = {
                where: { [Op.and]: [{ id: req.params.custBookingId }, { UserId: req.user.id }] },
                attributes: ["id", "UserId", "ScheduleId", "linkMeet", "paymentStatus"],
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

    static async booking(req, res, next) {
        // const t = await sequelize.transaction();
        try {
            const schedule = await SchedulePsikolog.findOne({
                where: {
                    id: req.body.schedulePsikologId,
                },
            });
            if (!schedule) {
                throw { status: 404, message: "schedule not found" };
            }
            let data;
            let VAPaymentMidtrans;
            const bank = ["bca", "bni", "permata"];

            const checkBank = bank.some((el) => el === req.body.bank.toLowerCase());

            if (!checkBank) {
                throw { status: 400, message: "bank not found" };
            }

            if (req.body.bank.toLowerCase() === "permata") {
                data = {
                    payment_type: "permata",
                    transaction_details: {
                        order_id: `${req.user.username}-${Math.ceil(Math.random() * 9999)}`,
                        gross_amount: schedule.price,
                    },
                    customer_details: {
                        email: req.user.email,
                    },
                };
            } else {
                data = {
                    payment_type: "bank_transfer",
                    transaction_details: {
                        order_id: `${req.user.username}-${Math.ceil(Math.random() * 9999)}`,
                        gross_amount: schedule.price,
                    },
                    bank_transfer: {
                        bank: req.body.bank,
                    },
                    customer_details: {
                        email: req.user.email,
                    },
                };
            }

            const charge = await axios({
                method: "POST",
                url: "https://api.sandbox.midtrans.com/v2/charge",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `${process.env.SERVER_KEY_MIDTRANS}`,
                },
                data,
            });

            if (charge.data.status_code !== "201") {
                throw { status: +charge.data.status_code, message: charge.data.status_message };
            }
            // sudah masuk ke email
            if (req.body.bank.toLowerCase() === "permata") {
                VAPaymentMidtrans = charge.data.permata_va_number;
            } else if (req.body.bank.toLowerCase() === "bca" || req.body.bank.toLowerCase() === "bni") {
                VAPaymentMidtrans = charge.data.va_numbers[0].va_number;
            } else {
                VAPaymentMidtrans = "failed to get virtual account (VA)";
            }

            await CustomerBooking.create({
                UserId: req.user.id,
                ScheduleId: req.body.schedulePsikologId,
                linkMeet: "your meeting link hasn't been generated yet",
                paymentStatus: charge.data.transaction_status,
                orderIdMidtrans: charge.data.order_id,
                VAPaymentMidtrans,
            });
            res.status(200).json({ message: "testing", orderId: charge.data.order_id });
            // await t.commit();
        } catch (error) {
            // await t.rollback();
            next(error);
        }
    }
}

module.exports = Controller;
