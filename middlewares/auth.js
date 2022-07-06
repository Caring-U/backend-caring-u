const { verify } = require("../helpers/jwt");
const { User, CustomerBooking } = require("../models");

module.exports = {
    async authentication(req, res, next) {
        try {
            const access_token = req.headers.access_token;
            if (!access_token) {
                throw {
                    status: false,
                    message: "Please Login First!",
                };
            }

            let decoded = verify(access_token);
            const user = await User.findOne({ where: { email: decoded.email } });

            if (!user) throw { status: false, message: "Please Login First!" };
            // req.user = user
            req.user = {
                id: user.id,
                username: user.username,
            };
            next();
        } catch (error) {
            next(error);
        }
    },

    async authorizeClientOwner(req, res, next) {
        try {
            // cek Customer Booking apakah ada atau tidak
            const checkingCustomerBooking = await CustomerBooking.findByPk(req.params.custBookingId);
            if (!checkingCustomerBooking) throw { name: "NotFound", message: "Customer Booking Not Found" };

            // cek kepemilikan customer booking dan allowed access
            if (checkingCustomerBooking.UserId != req.user.id) throw { name: "Forbidden", message: "not Allowed access" };
            next();
        } catch (error) {
            next(error);
        }
    },
};
