const express = require('express')
const {
  list,
  detail,
  update,
  updatePhoto,
  inputPortofolio,
  inputExperience,
  removeExperience,
  removePortofolio
} = require('../controllers/user.controller')
const upload = require('../middlewares/upload')
const jwtAuth = require('../middlewares/jwtAuth')

const router = express.Router()

router
  .get('/user', list)
  .get('/user/:id', jwtAuth, detail)
  .put('/user/:id', jwtAuth, update)
  .put('/user/:id/photo', jwtAuth, upload, updatePhoto)
  .post('/portofolio', jwtAuth, upload, inputPortofolio)
  .post('/experience', jwtAuth, inputExperience)
  .delete('/experience/:id', jwtAuth, removeExperience)
  .delete('/portofolio/:id', jwtAuth, removePortofolio)

module.exports = router
