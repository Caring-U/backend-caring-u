const request = require("supertest");
const app = require("../app");
const { sequelize, User } = require("../models");
const { queryInterface } = sequelize;
const { sign } = require("../helpers/jwt");

const users = {
    username: "nas",
    email: "nas@gmail.com",
    password: "nas123",
    role: "client",
};

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
const custBooking = require("../db/customerBooking.json").map((el) => {
    el.createdAt = new Date();
    el.updatedAt = new Date();

    return el;
});

let access_token;

beforeAll(async () => {
    try {
        const toClear = {
            truncate: true,
            cascade: true,
            restartIdentity: true,
        };
        await queryInterface.bulkDelete("Users", null, toClear);
        await queryInterface.bulkDelete("ProfilePsikologs", null, toClear);
        await queryInterface.bulkDelete("SchedulePsikologs", null, toClear);
        await queryInterface.bulkDelete("CustomerBookings", null, toClear);

        await User.create(users);

        // await queryInterface.bulkInsert("Users", users);
        await queryInterface.bulkInsert("ProfilePsikologs", psikologProfile);
        await queryInterface.bulkInsert("SchedulePsikologs", scheculePsikolog);
        await queryInterface.bulkInsert("CustomerBookings", custBooking);

        access_token = sign({ email: users.email });
    } catch (error) {
        console.log(error);
    }
});

afterAll(async () => {
    try {
        const toClear = {
            truncate: true,
            cascade: true,
            restartIdentity: true,
        };
        await queryInterface.bulkDelete("Users", null, toClear);
        await queryInterface.bulkDelete("ProfilePsikologs", null, toClear);
        await queryInterface.bulkDelete("SchedulePsikologs", null, toClear);
        await queryInterface.bulkDelete("CustomerBookings", null, toClear);
    } catch (error) {
        console.log(error);
    }
});

test("customer booking: client login", (done) => {
    request(app)
        .get("/client")
        .set("access_token", access_token)
        .expect(200)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});

test("customer booking: details", (done) => {
    request(app)
        .get("/client/1")
        .set("access_token", access_token)
        .expect(200)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});

// test("customer booking: booking", (done) => {
//     request(app)
//         .post("/client/booking")
//         .set("access_token", access_token)
//         .expect(200)
//         .then((response) => {
//             done();
//         })
//         .catch((err) => done(err));
// });
