const db = require('../config/db')

module.exports = {
  selectAll: (paging, search, sort, sortType) => new Promise((resolve, reject) => {
    db.query(`SELECT  jobseekers.id, login.name, login.email, login.phone, login.created_date, jobseekers.job_description, jobseekers.address, jobseekers.workplace, jobseekers.photo, jobseekers.description, jobseekers.created_date, jobseekers.skill_name FROM jobseekers INNER JOIN login ON jobseekers.login_id = login.id WHERE LOWER(login.name) LIKE '%${search.toLowerCase()}%' ORDER BY ${sort} ${sortType} LIMIT ${paging.limit} OFFSET ${paging.offset};`, (error, result) => {
      if (error) {
        reject(error)
      }
      resolve(result)
    })
  }),
  selectById: (id) => new Promise((resolve, reject) => {
    db.query('SELECT  jobseekers.id, login.name, login.email, login.phone, login.created_date, jobseekers.job_description, jobseekers.address, jobseekers.workplace, jobseekers.photo, jobseekers.description, jobseekers.created_date, jobseekers.skill_name, jobseekers.login_id FROM jobseekers INNER JOIN login ON jobseekers.login_id = login.id WHERE jobseekers.id=$1', [id], (error, result) => {
      if (error) {
        reject(error)
      }
      resolve(result)
    })
  }),
  selectByIdUser: (id) => new Promise((resolve, reject) => {
    db.query('SELECT * FROM jobseekers WHERE login_id=$1', [id], (error, result) => {
      if (error) {
        reject(error)
      }
      resolve(result)
    })
  }),
  input: (body) => new Promise((resolve, reject) => {
    const {
      id,
      jobDescription = '',
      address = '',
      workplace = '',
      photo = '',
      loginID,
      createdDate,
      description = '',
      skillName
    } = body
    db.query(
      'INSERT INTO jobseekers (id, job_description, address, workplace, photo, login_id, created_date, description, skill_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [
        id,
        jobDescription,
        address,
        workplace,
        photo,
        loginID,
        createdDate,
        description,
        skillName
      ],
      (error, result) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      }
    )
  }),
  updateById: (id, body) => new Promise((resolve, reject) => {
    const {
      jobDescription,
      address,
      workplace,
      description,
      photo = '',
      skillName
    } = body

    db.query(
      'UPDATE jobseekers SET job_description=$1, address=$2, workplace=$3, description=$4, photo=$5, skill_name=$6 WHERE id=$7',
      [jobDescription, address, workplace, description, photo, skillName, id],
      (error, result) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      }
    )
  }),
  updatePhoto: (id, photo) => new Promise((resolve, reject) => {
    db.query(
      'UPDATE jobseekers SET photo=$1 WHERE id=$2',
      [photo, id],
      (error, result) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      }
    )
  }),
  removeById: (id) => new Promise((resolve, reject) => {
    db.query('DELETE FROM jobseekers WHERE id=$1', [id], (error, result) => {
      if (error) {
        reject(error)
      }
      resolve(result)
    })
  }),
  countAll: () => new Promise((resolve, reject) => {
    db.query('SELECT COUNT(*) FROM jobseekers', (error, result) => {
      if (error) {
        reject(error)
      }
      resolve(result)
    })
  })
}
