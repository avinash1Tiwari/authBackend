const dotenv = require('dotenv')

dotenv.config()


module.exports = {
PORT : process.env.PORT,
MONGODB_URL : process.env.MONGODB_URL,
SALT_ROUND : process.env.SALT_ROUND,
JWT_EXPIRE_TIME : process.env.JWT_EXPIRE_TIME,
SECRETE_KEY : process.env.SECRETE_KEY
}