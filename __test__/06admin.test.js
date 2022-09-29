const request = require("supertest");
const app = require("../app");
const { sequelize, User } = require("../models");
const { queryInterface } = sequelize;
const { sign } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");

const users = {
    username: "wahyu",
    email: "wahyu@gmail.com",
    password: "112233",
    role: "admin",
};
const users1 = [
    {
        username: "nas",
        email: "nas@gmail.com",
        password: hashPassword("112233"),
        role: "client",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        username: "nanas",
        email: "nanas@gmail.com",
        password: hashPassword("112233"),
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

const psikologProfile = [
    {
        UserId: 2,
        fullname: "nasrun",
        imageUrl: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80",
        description:
            "Fajrin atau yang akrab disapa dengan Arin merupakan seorang Psikolog Klinis yang memiliki ketertarikan pada anak, remaja, dan dewasa. Arin berfokus kepada mengembangkan individu dengan membantu melalui kekuatan/ kelebihan yang individu tersebut miliki. Hal tersebut didapatkan melalui rasa percaya, aman, dan empati satu sama lain antara Arin dengan individu tersebut dalam menghadapi suatu permasalahan/ kasus. Beberapa ketertarikan dan pengalaman Arin dalam menangani kasus seperti gangguan belajar, hambatan intelektual, trauma, masalah emosi, gangguan bahasa, ketergantungan zat, kecemasan, depresi, dan gangguan suasana hati. Melalui konseling dengan Arin, diharapkan setiap individu dapat merasa diterima, memahami dirinya, hingga dapat memberdayakan dirinya agar dapat sejahtera secara psikologis serta tumbuh dan berkembang menjadi individu yang lebih baik lagi.",
        rating: 0,
        certificate: "certificate",
        status: "Pending",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        UserId: 3,
        fullname: "Rozikin",
        imageUrl: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80",
        description:
            "Rozikin atau yang akrab disapa dengan Arin merupakan seorang Psikolog Klinis yang memiliki ketertarikan pada anak, remaja, dan dewasa. Arin berfokus kepada mengembangkan individu dengan membantu melalui kekuatan/ kelebihan yang individu tersebut miliki. Hal tersebut didapatkan melalui rasa percaya, aman, dan empati satu sama lain antara Arin dengan individu tersebut dalam menghadapi suatu permasalahan/ kasus. Beberapa ketertarikan dan pengalaman Arin dalam menangani kasus seperti gangguan belajar, hambatan intelektual, trauma, masalah emosi, gangguan bahasa, ketergantungan zat, kecemasan, depresi, dan gangguan suasana hati. Melalui konseling dengan Arin, diharapkan setiap individu dapat merasa diterima, memahami dirinya, hingga dapat memberdayakan dirinya agar dapat sejahtera secara psikologis serta tumbuh dan berkembang menjadi individu yang lebih baik lagi.",
        rating: 0,
        certificate: "certificate",
        status: "Pending",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

let access_token;
let access_token2;

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
        //   await User.create(users1);
        await queryInterface.bulkInsert("Users", users1);
        await queryInterface.bulkInsert("ProfilePsikologs", psikologProfile);
    } catch (error) {
        console.log(error);
    }
});

test("login: success", (done) => {
    request(app)
        .post("/users/login")
        .send({
            email: "wahyu@gmail.com",
            password: "112233",
        })
        .expect(200)
        .then((response) => {
            access_token = response.body.result;
            expect(response.body).toHaveProperty("result");

            done();
        })
        .catch((err) => done(err));
});

test("admin: allPsikolog", (done) => {
    request(app)
        .get("/admin/list-psikolog")
        .set("access_token", access_token)
        .expect(200)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});

test("admin: patchPsikolog by admin failed", (done) => {
    request(app)
        .patch("/admin/list-psikolog/9999")
        .set("access_token", access_token)
        .send({
            status: "Verify",
        })
        .expect(404)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});

test("admin: patchPsikolog by admin", (done) => {
    request(app)
        .patch("/admin/list-psikolog/1")
        .set("access_token", access_token)
        .send({
            status: "Verify",
        })
        .expect(200)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});
