const jobseekerModel = require('../models/jobseeker.model');
const authModel = require('../models/auth.model')
const experienceModel = require('../models/experience.model')
const portofolioModel = require('../models/portofolio.model');
const createPagination = require('../utils/createPagination');
const { success, failed } = require('../utils/createResponse');
const deleteFile = require('../utils/deleteFile');
const { use } = require('bcrypt/promises');

const { v4: uuidv4 } = require('uuid');

module.exports = {
    list: async (req, res) => {
        try {
            const { page, limit } = req.query;
            const count = await jobseekerModel.countAll();
            const paging = createPagination(count.rows[0].count, page, limit);
            const users = await jobseekerModel.selectAll(paging);

            success(res, {
                code: 200,
                payload: users.rows,
                message: 'Select List User Success',
                pagination: paging.response,
            });
        } catch (error) {
            failed(res, {
                code: 500,
                payload: error.message,
                message: 'Internal Server Error',
            });
        }
    },
    detail: async (req, res) => {
        try {
            const { id } = req.params;

            const user = await jobseekerModel.selectById(id);

            // jika user tidak ditemukan
            if (!user.rowCount) {
                failed(res, {
                    code: 404,
                    payload: `User with Id ${id} not found`,
                    message: 'Select Detail User Failed',
                });
                return;
            }

            const experience = await experienceModel.selectById(user.rows[0].id)
            const portofolio = await portofolioModel.selectById(user.rows[0].id)

            success(res, {
                code: 200,
                payload: { user: user.rows[0], experience: experience.rows, portofolio: portofolio.rows },
                message: 'Select Detail User Success',
            });
        } catch (error) {
            failed(res, {
                code: 500,
                payload: error.message,
                message: 'Internal Server Error',
            });
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;

            const user = await jobseekerModel.selectById(id);
            // jika user tidak ditemukan
            if (!user.rowCount) {
                failed(res, {
                    code: 404,
                    payload: `User with Id ${id} not found`,
                    message: 'Update User Failed',
                });
                return;
            }

            // update name from auth model
            await authModel.updateNameById(user.rows[0].login_id, req.body.name)

            // jika update user disertai photo
            const { photo, email } = user.rows[0]; // email tidak boleh diubah
            await jobseekerModel.updateById(id, { ...req.body, photo, email });

            success(res, {
                code: 200,
                payload: null,
                message: 'Update User Success',
            });
        } catch (error) {
            failed(res, {
                code: 500,
                payload: error.message,
                message: 'Internal Server Error',
            });
        }
    },
    updatePhoto: async (req, res) => {
        try {
            const { id } = req.params;

            const user = await jobseekerModel.selectById(id);
            // jika user tidak ditemukan
            if (!user.rowCount) {
                // menghapus photo jika ada
                if (req.file) {
                    deleteFile(req.file.path);
                }

                failed(res, {
                    code: 404,
                    payload: `User with Id ${id} not found`,
                    message: 'Update User Failed',
                });
                return;
            }

            // jika update user disertai photo
            let { photo } = user.rows[0];
            if (req.file) {
                if (user.rows[0].photo) {
                    // menghapus photo lama
                    deleteFile(`public/${user.rows[0].photo}`);
                }
                // mendapatkan name photo baru
                photo = req.file.filename;
            }
            await jobseekerModel.updatePhoto(id, photo);

            success(res, {
                code: 200,
                payload: null,
                message: 'Update User Photo Success',
            });
        } catch (error) {
            failed(res, {
                code: 500,
                payload: error.message,
                message: 'Internal Server Error',
            });
        }
    },
    inputPortofolio: async (req, res) => {
        try {
            // const { id } = req.params;

            const idUser = req.APP_DATA.tokenDecoded.id

            const user = await jobseekerModel.selectByIdUser(idUser);

            //    create portofolio
            const { name, repository, type } = req.body

            const setDataPortofolio = {
                id: uuidv4(),
                name,
                repository,
                type,
                photo: req.file.filename,
                createdDate: new Date(),
                idJobseeker: user.rows[0].id
            }

            await portofolioModel.inputPortofolio(setDataPortofolio);

            success(res, {
                code: 200,
                payload: null,
                message: 'Input portofolio success',
            });
        } catch (error) {
            failed(res, {
                code: 500,
                payload: error.message,
                message: 'Internal Server Error',
            });
        }
    },
    inputExperience: async (req, res) => {
        try {
            // const { id } = req.params;

            const idUser = req.APP_DATA.tokenDecoded.id

            const user = await jobseekerModel.selectByIdUser(idUser);

            //   create experiences
            const { position, company, date, description } = req.body

            const setDataExperience = {
                id: uuidv4(),
                position,
                company,
                date,
                description,
                createdDate: new Date(),
                idJobseeker: user.rows[0].id
            }

            await experienceModel.inputExperience(setDataExperience);

            success(res, {
                code: 200,
                payload: null,
                message: 'input Experience success',
            });
        } catch (error) {
            failed(res, {
                code: 500,
                payload: error.message,
                message: 'Internal Server Error',
            });
        }
    },
    removePortofolio: async (req, res) => {
        try {
            const { id } = req.params;
            const portofolio = await portofolioModel.selectDetailPortofolio(id);

            // jika portofolio tidak ditemukan
            if (!portofolio.rowCount) {
                failed(res, {
                    code: 404,
                    payload: `portofolio with Id ${id} not found`,
                    message: 'Delete portofolio Failed',
                });
                return;
            }

            const idUser = req.APP_DATA.tokenDecoded.id

            const user = await jobseekerModel.selectByIdUser(idUser);

            if (!user.rows[0].id === portofolio.rows[0].jobseeker_id) {
                failed(res, {
                    code: 404,
                    payload: `portofolio with Id ${id} not found`,
                    message: 'You dont have access this action',
                });
                return;
            }

            await portofolioModel.removeById(id);

            // menghapus photo jika ada
            if (portofolio.rows[0].photo) {
                deleteFile(`public/${portofolio.rows[0].photo}`);
            }

            success(res, {
                code: 200,
                payload: null,
                message: 'Delete portofolio Success',
            });
        } catch (error) {
            failed(res, {
                code: 500,
                payload: error.message,
                message: 'Internal Server Error',
            });
        }
    },
    removeExperience: async (req, res) => {
        try {
            const { id } = req.params;
            const experience = await experienceModel.selectDetailExperience(id);

            // jika experience tidak ditemukan
            if (!experience.rowCount) {
                failed(res, {
                    code: 404,
                    payload: `experience with Id ${id} not found`,
                    message: 'Delete experience Failed',
                });
                return;
            }

            const idUser = req.APP_DATA.tokenDecoded.id

            const user = await jobseekerModel.selectByIdUser(idUser);

            if (!user.rows[0].id === experience.rows[0].jobseeker_id) {
                failed(res, {
                    code: 404,
                    payload: `experience with Id ${id} not found`,
                    message: 'You dont have access this action',
                });
                return;
            }

            await experienceModel.removeById(id);

            // menghapus photo jika ada
            // if (experience.rows[0].photo) {
            //     deleteFile(`public/${experience.rows[0].photo}`);
            // }

            success(res, {
                code: 200,
                payload: null,
                message: 'Delete experience Success',
            });
        } catch (error) {
            failed(res, {
                code: 500,
                payload: error.message,
                message: 'Internal Server Error',
            });
        }
    },
};
