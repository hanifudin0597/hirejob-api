const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const recruiterModel = require('../models/authrecruiter.model')
const jwtToken = require('../utils/generateJwtToken')
const { failed, success } = require('../utils/createResponse')

module.exports = {
  register: async (req, res) => {
    try {
      const user = await recruiterModel.selectByEmail(req.body.email)
      if (user.rowCount) {
        failed(res, {
          code: 409,
          payload: 'Email already exist',
          message: 'Register Failed'
        })
        return
      }
      bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) {
          failed(res, { code: 400, payload: err.message, message: 'failed hash password' })
        }

        recruiterModel.register({
          id: uuidv4(),
          ...req.body,
          hash,
          level: '2',
          createdDate: new Date()
        })

        const getID = await recruiterModel.selectByEmail(req.body.email)
        // console.log(getID)
        recruiterModel.registerRecruiter({
          ...req.body,
          id: uuidv4(),
          loginId: getID.rows[0].id,
          createdDate: new Date()
        })

        success(res, {
          code: 201,
          payload: null,
          message: 'Register Success'
        })
      })
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: 'Internal Server Error'
      })
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body
      const user = await recruiterModel.login(email)
      const userId = await recruiterModel.selectByIdUser(user.rows[0].id)

      // jika user ditemukan
      if (user.rowCount > 0) {
        const match = await bcrypt.compare(password, user.rows[0].password)
        // jika password benar
        if (match) {
          const jwt = await jwtToken({
            id: user.rows[0].id,
            level: user.rows[0].level
          })
          success(res, {
            code: 200,
            payload: null,
            message: 'Login Success',
            token: {
              jwt,
              id: user.rows[0].id,
              idRecruiter: userId.rows[0].id
            }
          })
          return
        }
      }

      failed(res, {
        code: 401,
        payload: 'Wrong Email or Password',
        message: 'Login Failed'
      })
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: 'Internal Server Error'
      })
    }
  }
}
