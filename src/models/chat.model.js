const db = require('../config/db')

module.exports = {
//   selectAll: () => new Promise((resolve, reject) => {
//     db.query('SELECT * FROM experiences', (error, result) => {
//       if (error) {
//         reject(error)
//       }
//       resolve(result)
//     })
//   }),
  detailMessage: (id) => new Promise((resolve, reject) => {
    db.query('SELECT * FROM messages WHERE to_id=$1', [id], (error, result) => {
      if (error) {
        reject(error)
      }
      resolve(result)
    })
  }),
  createMessage: (body) => new Promise((resolve, reject) => {
    const {
      id,
      from,
      to,
      messageContent,
      recruiterId
    } = body
    db.query(
      'INSERT INTO messages (id, from_id, to_id, message, recruiter_id) VALUES ($1, $2, $3, $4, $5)',
      [
        id,
        from,
        to,
        messageContent,
        recruiterId
      ],
      (error, result) => {
        if (error) {
          console.log('hello')
          reject(error)
        }
        resolve(result)
      }
    )
  })
}
