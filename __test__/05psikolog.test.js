const request = require("supertest");
const app = require("../app");
const { sequelize, User } = require("../models");
const { queryInterface } = sequelize;
const { sign } = require("../helpers/jwt");

const users = {
    username: "nas",
    email: "nas@gmail.com",
    password: "nas123",
    role: "psikolog",
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

        await User.create(users);

        // await queryInterface.bulkInsert("Users", users);
        //
        access_token = sign({ email: users.email });
    } catch (error) {
        console.log(error);
    }
});

afterAll(async () => {
    try {
        await queryInterface.bulkDelete("Users", null, toClear);
        await queryInterface.bulkDelete("ProfilePsikologs", null, toClear);
        await queryInterface.bulkDelete("SchedulePsikologs", null, toClear);
        await queryInterface.bulkDelete("CustomerBookings", null, toClear);
    } catch (error) {
        console.log(error);
    }
});

test("psikolog: createProfile", async () => {
    try {
        const response = await request(app).post("/psikolog/profile").set("access_token", access_token).send({
            UserId: 1,
            fullname: "nanas",
            imageUrl: "bolo bolo",
            description: "bolo bolo",
            rating: 0,
            certificate: "update your sertificat",
        });
        expect(201);

        await queryInterface.bulkDelete("ProfilePsikologs", null, toClear);
        await queryInterface.bulkInsert("ProfilePsikologs", psikologProfile);
        await queryInterface.bulkInsert("SchedulePsikologs", scheculePsikolog);
        await queryInterface.bulkInsert("CustomerBookings", custBooking);
    } catch (error) {
        console.log(error);
    }
});

// /psikolog
test("psikolog: login", (done) => {
    request(app)
        .get("/psikolog")
        .set("access_token", access_token)
        .expect(200)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});

test("psikolog: createProfile sudah ada", async () => {
   try {
       const response = await request(app).post("/psikolog/profile").set("access_token", access_token).send({
           UserId: 1,
           fullname: "nanas",
           imageUrl: "bolo bolo",
           description: "bolo bolo",
           rating: 0,
           certificate: "update your sertificat",
       });
       expect(403);

   } catch (error) {
       console.log(error);
   }
});

test("psikolog: profile", (done) => {
    request(app)
        .get("/psikolog/profile")
        .set("access_token", access_token)
        .expect(200)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});

test("psikolog: createSchedule", (done) => {
    request(app)
        .post("/psikolog/profile/schedule")
        .set("access_token", access_token)
        .send({
            PsikologId: 1,
            day: new Date(),
            time: new Date(),
        })
        .expect(201)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});

test("psikolog: detailSchedule", (done) => {
    request(app)
        .get("/psikolog/1")
        .set("access_token", access_token)
        .expect(200)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});
