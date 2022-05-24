const { reject } = require('bcrypt/promises');
const db = require('../config/db');

module.exports = {
    selectAll: () => new Promise((resolve, reject) => {
        db.query(`SELECT * FROM portofolios`, (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    }),
    selectById: (id) => new Promise((resolve, reject) => {
        db.query(`SELECT * FROM portofolios WHERE jobseeker_id=$1`, [id], (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    }),
    selectDetailPortofolio: (id) => new Promise((resolve, reject) => {
        db.query(`SELECT * FROM portofolios WHERE id=$1`, [id], (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    }),
    inputPortofolio: (body) => new Promise((resolve, reject) => {
        const {
            id,
            name,
            repository,
            type,
            photo,
            createdDate,
            idJobseeker
        } = body;
        db.query(
            'INSERT INTO portofolios (id, name, repository, type, photo, created_date, jobseeker_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [
                id,
                name,
                repository,
                type,
                photo,
                createdDate,
                idJobseeker
            ],
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            },
        );
    }),
    updateById: (id, body) => new Promise((resolve, reject) => {
        const {
            name,
            repository,
            type,
            photo,
            createdDate,
            idJobseeker
        } = body;

        db.query(
            'UPDATE portofolios SET name=$1, repository=$2, type=$3, photo=$4, created_date=$5, jobseeker_id=$6 WHERE id=$7',
            [
                name,
                repository,
                type,
                photo,
                createdDate,
                idJobseeker,
                id
            ],
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            },
        );
    }),
    removeById: (id) => new Promise((resolve, reject) => {
        db.query('DELETE FROM portofolios WHERE id=$1', [id], (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    }),
};
