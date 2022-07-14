const request = require("supertest");
const app = require("../app");
const { sequelize, User, CustomerBooking } = require("../models");
const { queryInterface } = sequelize;
const { sign } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");

const users = {
    username: "nas",
    email: "nas@gmail.com",
    password: "nas123",
    role: "client",
};
const users1 = [
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
];

const scheculePsikolog = [
    {
        PsikologId: 1,
        day: new Date(),
        time: "pagi",
        price: 150000,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        PsikologId: 1,
        day: new Date(),
        time: "pagi",
        price: 150000,
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
];

const custBooking = [
    {
        UserId: 1,
        ScheduleId: 1,
        linkMeet: null,
        paymentStatus: "pending",
        orderIdMidtrans: "idmidtrans",
        VAPaymentMidtrans: "payment",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        UserId: 1,
        ScheduleId: 2,
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

        await User.create(users);
        await queryInterface.bulkInsert("Users", users1);
        // await CustomerBooking.create(custBooking);
        await queryInterface.bulkInsert("ProfilePsikologs", psikologProfile, {});

        await queryInterface.bulkInsert("SchedulePsikologs", scheculePsikolog, {});

        await queryInterface.bulkInsert("CustomerBookings", custBooking, {});
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
            access_token = response.body.result;
            expect(response.body).toHaveProperty("result");
            done();
        })
        .catch((err) => done(err));
});

test("customer booking: client failed login", (done) => {
    request(app)
        .get("/client")
        .expect(401)
        .then((response) => {
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
            // console.log(response._body);
            done();
        })
        .catch((err) => done(err));
});

test("customer booking: details failed", (done) => {
    request(app)
        .get("/client/1")
        .expect(401)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});

test("customer booking: details not found", (done) => {
    request(app)
        .get("/client/9999")
        .set("access_token", access_token)
        .expect(404)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});

test("customer booking: details not found no login", (done) => {
    request(app)
        .get("/client/9999")
        .expect(401)
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

let order_id;

test("customer booking: booking PERMATA", (done) => {
    request(app)
        .post("/client/booking")
        .set("access_token", access_token)
        .send({
            schedulePsikologId: 1,
            bank: "permata",
        })
        .expect(200)
        .then((response) => {
            // console.log(response.body);
            order_id = response.body.orderId;
            done();
        })
        .catch((err) => done(err));
});

test("customer booking: booking BCA", (done) => {
    request(app)
        .post("/client/booking")
        .set("access_token", access_token)
        .send({
            schedulePsikologId: 1,
            bank: "bca",
        })
        .expect(200)
        .then((response) => {
            // console.log(response.body);
            order_id = response.body.orderId;
            done();
        })
        .catch((err) => done(err));
});

test("customer booking: booking failed schedulePsikologId", (done) => {
    request(app)
        .post("/client/booking")
        .set("access_token", access_token)
        .expect(500)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});
test("customer booking: booking failed schedulePsikologId", (done) => {
    request(app)
        .post("/client/booking")
        .set("access_token", access_token)
        .send({
            schedulePsikologId: "99",
            bank: "permata",
        })
        .expect(404)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});
test("customer booking: booking failed bank", (done) => {
    request(app)
        .post("/client/booking")
        .set("access_token", access_token)
        .send({
            schedulePsikologId: 1,
            bank: "bri",
        })
        .expect(400)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});

test("customer booking: notification failed pending", (done) => {
    request(app)
        .post("/notifikasi-midtrans")
        .send({
            transaction_status: "",
            order_id,
        })
        .expect(200)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});
test("customer booking: notification change unpaid", (done) => {
    request(app)
        .post("/notifikasi-midtrans")
        .send({
            transaction_status: "deny",
            order_id,
        })
        .expect(200)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});

test("customer booking: notification", (done) => {
    request(app)
        .post("/notifikasi-midtrans")
        .send({
            transaction_status: "settlement",
            order_id,
        })
        .expect(200)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});

test("customer booking: notification error", (done) => {
    request(app)
        .post("/notifikasi-midtrans")
        .expect(500)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});

test("customer booking: notification error", (done) => {
    request(app)
        .post("/notifikasi-midtrans")
        .send({
            transaction_status: "settlement",
        })
        .expect(500)
        .then((response) => {
            done();
        })
        .catch((err) => done(err));
});
