const { hashSync, genSaltSync, compareSync } = require("bcryptjs")

module.exports = {
    hashPassword: (password) => hashSync(password, genSaltSync(10)),
    comparePassword: (password, db_password) => compareSync(password, db_password)
};