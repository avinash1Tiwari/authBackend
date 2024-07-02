

const mongoose = require('mongoose')

const {ServerConfig} = require('./index')

const dbConnect = () =>{

    mongoose.connect(ServerConfig.MONGODB_URL)
    .then(console.log("DB connection successfully"))
    .catch((error) => {
        console.log("issue in DB connection")
        console.log(error)
        process.exit(1)
    })
}


module.exports = dbConnect

