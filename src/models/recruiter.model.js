const db = require('../config/db');

module.exports = {
    selectAll: (paging, search) => new Promise((resolve, reject) => {
        db.query(`SELECT  recruiters.id, login.name, login.email, login.phone, login.created_date, recruiters.company_name, recruiters.company_type, recruiters.city, recruiters.description, recruiters.instagram, recruiters.linkedin, recruiters.position, recruiters.photo, recruiters.created_date, recruiters.email_company, recruiters.phone_company FROM recruiters INNER JOIN login ON recruiters.login_id = login.id WHERE LOWER(login.name) LIKE '%${search.toLowerCase()}%' LIMIT ${paging.limit} OFFSET ${paging.offset};`, (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);

        });
    }),
    selectById: (id) => new Promise((resolve, reject) => {
        db.query('SELECT  recruiters.id, login.name, login.email, login.phone, login.created_date, recruiters.company_name, recruiters.company_type, recruiters.city, recruiters.description, recruiters.instagram, recruiters.linkedin, recruiters.position, recruiters.photo, recruiters.created_date, recruiters.email_company, recruiters.phone_company, recruiters.login_id FROM recruiters INNER JOIN login ON recruiters.login_id = login.id WHERE recruiters.id=$1', [id], (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    }),
    selectByIdUser: (id) => new Promise((resolve, reject) => {
        db.query(`SELECT * FROM jobseekers WHERE login_id=$1`, [id], (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    }),
    // input: (body) => new Promise((resolve, reject) => {
    //     const {
    //         id,
    //         jobDescription = '',
    //         address = '',
    //         workplace = '',
    //         photo = '',
    //         loginID,
    //         createdDate,
    //         description = '',
    //         skillName
    //     } = body;
    //     db.query(
    //         'INSERT INTO jobseekers (id, job_description, address, workplace, photo, login_id, created_date, description, skill_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
    //         [
    //             id,
    //             jobDescription,
    //             address,
    //             workplace,
    //             photo,
    //             loginID,
    //             createdDate,
    //             description,
    //             skillName
    //         ],
    //         (error, result) => {
    //             if (error) {
    //                 reject(error);
    //             }
    //             resolve(result);
    //         },
    //     );
    // }),
    updateById: (id, body) => new Promise((resolve, reject) => {
        const {
            companyName = '',
            companyType = '',
            city = '',
            description = '',
            emailCompany = '',
            instagram = '',
            phoneCompany = '',
            linkedin = '',
        } = body;

        db.query(
            'UPDATE recruiters SET company_name=$1, company_type=$2, city=$3, description=$4, email_company=$5, instagram=$6, phone_company=$7, linkedin=$8 WHERE id=$9',
            [
                companyName,
                companyType,
                city,
                description,
                emailCompany,
                instagram,
                phoneCompany,
                linkedin,
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
    updatePhoto: (id, photo) => new Promise((resolve, reject) => {
        db.query(
            'UPDATE recruiters SET photo=$1 WHERE id=$2',
            [photo, id],
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            },
        );
    }),
    removeById: (id) => new Promise((resolve, reject) => {
        db.query('DELETE FROM jobseekers WHERE id=$1', [id], (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    }),
    countAll: () => new Promise((resolve, reject) => {
        db.query('SELECT COUNT(*) FROM recruiters', (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    }),
};
