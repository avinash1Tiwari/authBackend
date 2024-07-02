const express = require('express')

const {ServerConfig} = require('./config')

const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()


const bodyParser = require('body-parser')

const userRoutes = require('./routes/userRoutes')

// call cokie as first middleware

// app.use(cors())
app.use(cors(
    {credentials:true,
    origin:'http://localhost:3000'}
))

app.use(cookieParser())

// middleware
app.use(bodyParser.json())


const dbConnect = require('./config/database')

dbConnect()


console.log("api")

app.use('/api',userRoutes)


// app.get('/api/check', (req, res) => {
//     res.status(200).json({
//         message: "Successfully connected to frontend"
//     });
// })


app.listen(ServerConfig.PORT || 3002,(req,res) => {
    console.log(`Successfully started the server at : ${ServerConfig.PORT}`)
})




// jOvW76QAvZmrpAxc