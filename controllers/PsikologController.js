const { CustomerBooking, User, SchedulePsikolog, ProfilePsikolog } = require("../models");

module.exports = class Controller {
    static async getAllSchedule(req, res, next) { //masih belum fix
        try {
            const data = await SchedulePsikolog.findAndCountAll({
                include: [
                    {
                        model: ProfilePsikolog,
                        where: {
                            UserId: req.user.id,
                        },
                    },
                    {
                        model: CustomerBooking,
                        include: [User],
                    },
                ],
                order: [["id", "DESC"]],
            });
            res.status(200).json({ status: true, result: data });
        } catch (error) {
            next(error);
        }
    }

    static async detailSchedule(req, res, next) {
        try {
            const data = await SchedulePsikolog.findOne({
                where: {
                    id: req.params.ScheduleId,
                },
                include: [
                    {
                        model: ProfilePsikolog,
                        where: {
                            UserId: req.user.id,
                        },
                    },
                    {
                        model: CustomerBooking,
                        include: [User],
                    },
                ],
            });
            res.status(200).json({ status: true, result: data });
        } catch (error) {
            next(error);
        }
    }

    static async profilePsikolog(req, res, next) {
        try {
            const data = await ProfilePsikolog.findOne({
                where: {
                    UserId: req.user.id,
                },
                include: [
                    {
                        model: SchedulePsikolog,
                    },
                ],
            });
            res.status(200).json({ status: true, result: data });
        } catch (error) {
            next(error);
        }
    }

    static async createProfile(req, res, next) {
        try {
            const data = {
                UserId: req.user.id,
                fullname: req.body.fullname,
                imageUrl: req.body.imageUrl,
                description: req.body.description,
                rating: 0,
                certificate: req.body.certificate,
                status: "Pending",
            };
            await ProfilePsikolog.create(data);
            res.status(201).json({ status: true, message: "success create profile" });
        } catch (error) {
            next(error);
        }
    }

    static async patchProfile(req, res, next) {
        try {
            const psikolog = await ProfilePsikolog.findOne({
                where: {
                    UserId: req.user.id,
                },
            });
            if (!psikolog) throw { name: "NotFound", message: "not allowed access" };
            const edited = {
                fullname: req.body.fullname,
                imageUrl: req.body.imageUrl,
                description: req.body.description,
                certificate: req.body.certificate,
            };
            const editPsikolog = await ProfilePsikolog.update(edited, {
                where: {
                    UserId: req.user.id,
                },
                returning: true,
            });

            res.status(200).json({ status: true, result: editPsikolog[1][0] });
        } catch (error) {
            next(error);
        }
    }

    static async createSchedule(req, res, next) {
        try {
            const data = {
                PsikologId: req.profilePsikolog.id,
                day: req.body.day,
                // time: req.body.time,
            };
            await SchedulePsikolog.create(data);
            res.status(201).json({ status: true, message: "success create schedule" });
        } catch (error) {
            next(error);
        }
    }

    static async destroySchedule(req, res, next){
        try {
            await SchedulePsikolog.destroy({
                where : {
                    id : req.params.ScheduleId
                }
            })
            res.status(200).json({status : true, message : `success delete id schedule ${req.params.ScheduleId}`})
        } catch (error) {
            next(error);
        }
    }

    static async updateSchedule(req, res, next) {
        try {
            const data = {
                PsikologId: req.profilePsikolog.id,
                day: req.body.day,
                // time: req.body.time,
            };
            await SchedulePsikolog.update(data, {where : {
                id : req.params.ScheduleId
            }});
            res.status(200).json({status : true, message : `success update id schedule ${req.params.ScheduleId}`})
        } catch (error) {
            next(error);
        }
    }
};
