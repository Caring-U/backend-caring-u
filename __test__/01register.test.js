const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;

const user = {
    username: "nanas",
    email: "nanas@gmail.com",
    password: "112233",
    role: "psikolog",
};

beforeAll(async () => {
    try {
        const toClear = {
            truncate: true,
            cascade: true,
            restartIdentity: true,
        };
        await queryInterface.bulkDelete("Users", null, toClear);
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
    } catch (error) {
        console.log(error);
    }
});

// EMAIL TESTING
test("register: success", (done) => {
    request(app)
        .post("/users/register")
        .send(user)
        .expect(201)
        .then((response) => {
            // console.log(response.body);
            done();
        })
        .catch((err) => done(err));
});

test("register: email not entered", (done) => {
    request(app)
        .post("/users/register")
        .send({
            username: "nanas",
            password: "112233",
            role: "psikolog",
        })
        .expect(400)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});
test("register: email incorrect format", (done) => {
    request(app)
        .post("/users/register")
        .send({
            username: "haha",
            email: "nanasgmail.com",
            password: "112233",
            role: "psikolog",
        })
        .expect(400)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});
test("register: email's empty", (done) => {
    request(app)
        .post("/users/register")
        .send({
            username: "nanas",
            email: "",
            password: "112233",
            role: "psikolog",
        })
        .expect(400)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});
test("register: email registered", (done) => {
    request(app)
        .post("/users/register")
        .send(user)
        .expect(400)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});

// PASSWORD TESTING
test("register: password not entered", (done) => {
    request(app)
        .post("/users/register")
        .send({
            username: "nanas",
            email: "nanas@gmail.com",
            role: "psikolog",
        })
        .expect(400)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});

test("register: password's empty", (done) => {
    request(app)
        .post("/users/register")
        .send({
            username: "nanas",
            email: "nanas@gmail.com",
            password: "",
            role: "psikolog",
        })
        .expect(400)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});

// USERNAME TESTING
test("register: username not entered", (done) => {
    request(app)
        .post("/users/register")
        .send({
            email: "nanas@gmail.com",
            password: "112233",
            role: "psikolog",
        })
        .expect(400)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});

test("register: username's empty", (done) => {
    request(app)
        .post("/users/register")
        .send({
            username: "",
            email: "nanas@gmail.com",
            password: "112233",
            role: "psikolog",
        })
        .expect(400)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});

test("register: username registered", (done) => {
    request(app)
        .post("/users/register")
        .send(user)
        .expect(400)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});

// ROLE TESTING
test("register: role's empty", (done) => {
    request(app)
        .post("/users/register")
        .send({
            username: "nanas",
            email: "nanas@gmail.com",
            password: "112233",
            role: "",
        })
        .expect(400)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});
