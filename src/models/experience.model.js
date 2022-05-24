const db = require('../config/db');

module.exports = {
    selectAll: () => new Promise((resolve, reject) => {
        db.query(`SELECT * FROM experiences`, (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    }),
    selectById: (id) => new Promise((resolve, reject) => {
        db.query(`SELECT * FROM experiences WHERE jobseeker_id=$1`, [id], (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    }),
    selectDetailExperience: (id) => new Promise((resolve, reject) => {
        db.query(`SELECT * FROM experiences WHERE id=$1`, [id], (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    }),
    inputExperience: (body) => new Promise((resolve, reject) => {
        const {
            id,
            position,
            company,
            date,
            description,
            createdDate,
            idJobseeker
        } = body;
        db.query(
            'INSERT INTO experiences (id, position, company, date, description, created_date, jobseeker_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [
                id,
                position,
                company,
                date,
                description,
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
            position,
            company,
            date,
            description,
        } = body;

        db.query(
            'UPDATE experiences SET position=$1, company=$2, date=$3, description=$4 WHERE id=$5',
            [
                position,
                company,
                date,
                description,
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
    // updatePhoto: (id, photo) => new Promise((resolve, reject) => {
    //     db.query(
    //         'UPDATE jobseekers SET photo=$1 WHERE id=$2',
    //         [photo, id],
    //         (error, result) => {
    //             if (error) {
    //                 reject(error);
    //             }
    //             resolve(result);
    //         },
    //     );
    // }),
    removeById: (id) => new Promise((resolve, reject) => {
        db.query('DELETE FROM experiences WHERE id=$1', [id], (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    }),
};
