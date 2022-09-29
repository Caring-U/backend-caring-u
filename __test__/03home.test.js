const request = require("supertest");
const app = require("../app");
const { hashPassword } = require("../helpers/bcrypt");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;

const users = require("../db/users.json").map((el) => {
    el.password = hashPassword(el.password);

    el.createdAt = new Date();
    el.updatedAt = new Date();

    return el;
});
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

        await queryInterface.bulkInsert("Users", users);
        await queryInterface.bulkInsert("ProfilePsikologs", psikologProfile);
        await queryInterface.bulkInsert("SchedulePsikologs", scheculePsikolog);
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

test("psikolog: list", (done) => {
    request(app)
        .get("/list-psikolog")
        .expect(200)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});

test("psikolog: details", (done) => {
    request(app)
        .get(`/list-psikolog/1`)
        .expect(200)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});
