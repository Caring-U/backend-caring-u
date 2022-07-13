const request = require("supertest");
const app = require("../app");
const { sequelize, User, CustomerBooking } = require("../models");
const { queryInterface } = sequelize;
const { sign } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");

const users = [
    {
        username: "nanas",
        email: "nanas@gmail.com",
        password: hashPassword("112233"),
        role: "psikolog",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        username: "Rozikin",
        email: "rozikin@gmail.com",
        password: hashPassword("112233"),
        role: "psikolog",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        username: "nas",
        email: "nas@gmail.com",
        password: hashPassword("nas123"),
        role: "client",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

const psikologProfile = require("../db/psikologProfile.json").map((el) => {
    el.createdAt = new Date();
    el.updatedAt = new Date();

    return el;
});
const scheculePsikolog = require("../db/schedulePsikolog.json").map((el) => {
    el.createdAt = new Date();
    el.updatedAt = new Date();

    return el;
});
const custBooking = [
    {
        UserId: 3,
        ScheduleId: 1,
        linkMeet: null,
        paymentStatus: "pending",
        orderIdMidtrans: "idmidtrans",
        VAPaymentMidtrans: "payment",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        UserId: 3,
        ScheduleId: 3,
        linkMeet: null,
        paymentStatus: "pending",
        orderIdMidtrans: "idmidtrans",
        VAPaymentMidtrans: "payment",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

// let access_token = sign({ email: "nas@gmail.com" });
let access_token;
const toClear = {
    truncate: true,
    cascade: true,
    restartIdentity: true,
};

beforeAll(async () => {
    try {
        await queryInterface.bulkDelete("Users", null, toClear);
        await queryInterface.bulkDelete("ProfilePsikologs", null, toClear);
        await queryInterface.bulkDelete("SchedulePsikologs", null, toClear);
        await queryInterface.bulkDelete("CustomerBookings", null, toClear);

        // await User.create(users);

        await queryInterface.bulkInsert("Users", users);
        // await CustomerBooking.create(custBooking);
        await queryInterface.bulkInsert("CustomerBookings", custBooking);
        await queryInterface.bulkInsert("SchedulePsikologs", scheculePsikolog);
        await queryInterface.bulkInsert("ProfilePsikologs", psikologProfile);
    } catch (error) {
        console.log(error);
    }
});

// afterAll(async () => {
//     try {
//         await queryInterface.bulkDelete("Users", null, toClear);
//         await queryInterface.bulkDelete("ProfilePsikologs", null, toClear);
//         await queryInterface.bulkDelete("SchedulePsikologs", null, toClear);
//         await queryInterface.bulkDelete("CustomerBookings", null, toClear);
//     } catch (error) {
//         console.log(error);
//     }
// });

test("login: success", (done) => {
    request(app)
        .post("/users/login")
        .send({
            email: "nas@gmail.com",
            password: "nas123",
        })
        .expect(200)
        .then((response) => {
            // console.log(response._body.result);
            access_token = response._body.result;
            // expect(response.body).toHaveProperty("result");
            done();
        })
        .catch((err) => done(err));
});

test("customer booking: client login", (done) => {
    request(app)
        .get("/client")
        .set("access_token", access_token)
        .expect(200)
        .then((response) => {
            console.log(response._body);
            done();
        })
        .catch((err) => done(err));
});

// test("customer booking: details", (done) => {
//     request(app)
//         .get("/client/1")
//         .set("access_token", access_token)
//         .expect(200)
//         .then((response) => {
//             done();
//         })
//         .catch((err) => done(err));
// });

test("customer booking: booking", (done) => {
    request(app)
        .post("/client/booking")
        .set("access_token", access_token)
        .expect(200)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});
