const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");

const { queryInterface } = sequelize;
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
        username: "nas",
        email: "nas@gmail.com",
        password: hashPassword("nas123"),
        role: "client",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

beforeAll(async () => {
    try {
        const toClear = {
            truncate: true,
            cascade: true,
            restartIdentity: true,
        };
        await queryInterface.bulkDelete("Users", null, toClear);
        await queryInterface.bulkInsert("Users", users);
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

test("login: success", (done) => {
    request(app)
        .post("/users/login")
        .send({
            email: "nanas@gmail.com",
            password: "112233",
        })
        .expect(200)
        .then((response) => {
            // console.log(response);
            expect(response.body).toHaveProperty("result");
            done();
        })
        .catch((err) => done(err));
});

test("login: wrong email", (done) => {
    request(app)
        .post("/users/login")
        .send({
            email: "nas@gmail.com",
            password: "112233",
        })
        .expect(401)
        .then((response) => {
            // console.log(response);
            done();
        })
        .catch((err) => done(err));
});
test("login: wrong email", (done) => {
    request(app)
        .post("/users/login")
        .send({
            email: "wahyu@gmail.com",
            password: "112233",
        })
        .expect(401)
        .then((response) => {
            // console.log(response);
            done();
        })
        .catch((err) => done(err));
});

test("login: wrong password", (done) => {
    request(app)
        .post("/users/login")
        .send({
            email: "nanas@gmail.com",
            password: "nas123",
        })
        .expect(401)
        .then((response) => {
            // console.log(response);
            done();
        })
        .catch((err) => done(err));
});
