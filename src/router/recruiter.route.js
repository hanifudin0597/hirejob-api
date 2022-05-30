const express = require('express');
const {
    list,
    detail,
    update,
    updatePhoto,
} = require('../controllers/recruiter.controller');
const upload = require('../middlewares/upload');
const jwtAuth = require('../middlewares/jwtAuth');

const router = express.Router();

router
    .get('/company', list)
    .get('/company/:id', jwtAuth, detail)
    .put('/company/:id', jwtAuth, update)
    .put('/company/:id/photo', jwtAuth, upload, updatePhoto)
module.exports = router;
