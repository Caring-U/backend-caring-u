const { comparePassword } = require('../helpers/bcrypt');
const { sign } = require('../helpers/jwt');
const { User } = require('../models')

class UserController {
    static register (req, res) {
        const newUser = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        }

        User.create(newUser)
        .then((user) => {
            res.status(201).json({status : true, message : 'Successfully created a new account'})
        }).catch((err) => {
            console.log(err)
        });
    }

    static login (req, res) {
        const { email, password } = req.body

        User.findOne({
            where: {email}
        })
        .then((user) => {
            if(!user) {
                throw {
                    status: false,
                    message: "Invalid email or password"
                }
            } else {
                if (comparePassword(password, user.password)) {
                    const access_token = sign({ email: user.email})

                    res.status(200).json({
                        status: true,
                        data: {
                            access_token,
                            username: user.username,
                            email: user.email
                        }
                    })
                } else {
                    throw {
                        status: false,
                        message: "Invalid email or password"
                    }
                }
            }
        }).catch((err) => {
            console.log(err);
        });
    }
}

module.exports = UserController