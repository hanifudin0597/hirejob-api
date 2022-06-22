const recruiterModel = require('../models/recruiter.model')
const messageModel = require('../models/chat.model')
// const authRecruiterModel = require('../models/authrecruiter.model')
const createPagination = require('../utils/createPagination')
const { success, failed } = require('../utils/createResponse')
const deleteFile = require('../utils/deleteFile')
// const { use } = require('bcrypt/promises')

const { v4: uuidv4 } = require('uuid')

module.exports = {
  list: async (req, res) => {
    try {
      const { page, limit, search } = req.query
      const searchValue = search || ''
      const count = await recruiterModel.countAll()
      const paging = createPagination(count.rows[0].count, page, limit)
      const users = await recruiterModel.selectAll(paging, searchValue)

      success(res, {
        code: 200,
        payload: users.rows,
        message: 'Select List company Success',
        pagination: paging.response
      })
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: 'Internal Server Error'
      })
    }
  },
  detail: async (req, res) => {
    try {
      const { id } = req.params

      const user = await recruiterModel.selectById(id)

      // jika user tidak ditemukan
      if (!user.rowCount) {
        failed(res, {
          code: 404,
          payload: `User with Id ${id} not found`,
          message: 'Select Detail company Failed'
        })
        return
      }

      success(res, {
        code: 200,
        payload: user.rows[0],
        message: 'Select Detail company Success'
      })
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: 'Internal Server Error'
      })
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params

      const user = await recruiterModel.selectById(id)
      // jika user tidak ditemukan
      if (!user.rowCount) {
        failed(res, {
          code: 404,
          payload: `User with Id ${id} not found`,
          message: 'Update company Failed'
        })
        return
      }

      // jika update user disertai photo
      const { photo, email } = user.rows[0] // email tidak boleh diubah
      await recruiterModel.updateById(id, { ...req.body, photo, email })

      success(res, {
        code: 200,
        payload: null,
        message: 'Update company Success'
      })
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: 'Internal Server Error'
      })
    }
  },
  updatePhoto: async (req, res) => {
    try {
      const { id } = req.params

      const company = await recruiterModel.selectById(id)
      // jika company tidak ditemukan
      if (!company.rowCount) {
        // menghapus photo jika ada
        if (req.file) {
          deleteFile(req.file.path)
        }

        failed(res, {
          code: 404,
          payload: `company with Id ${id} not found`,
          message: 'Update photo company Failed'
        })
        return
      }

      // jika update company disertai photo
      let { photo } = company.rows[0]
      if (req.file) {
        if (company.rows[0].photo) {
          // menghapus photo lama
          deleteFile(`public/${company.rows[0].photo}`)
        }
        // mendapatkan name photo baru
        photo = req.file.filename
      }
      await recruiterModel.updatePhoto(id, photo)

      success(res, {
        code: 200,
        payload: null,
        message: 'Update company Photo Success'
      })
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: 'Internal Server Error'
      })
    }
  },
  createMessage: async (req, res) => {
    try {
      //    create message
      const { from, to, messageContent, recruiterId } = req.body

      const chatContent = {
        id: uuidv4(),
        from,
        to,
        messageContent,
        recruiterId
      }

      await messageModel.createMessage(chatContent)

      success(res, {
        code: 200,
        payload: null,
        message: 'Input message success'
      })
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: 'Internal Server Error'
      })
    }
  },
  detailMessage: async (req, res) => {
    try {
      const { id } = req.params

      const message = await messageModel.detailMessage(id)

      success(res, {
        code: 200,
        payload: message.rows,
        message: 'Select Detail message Success'
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
