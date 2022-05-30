const express = require('express')
const { register, login } = require('../controllers/authrecruiter.controller')

const route = express.Router()

route
    .post('/login/company', login)
    .post('/register/company', register)

module.exports = route