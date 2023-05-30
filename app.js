const express = require('express')
const app = express()
const bodyParser=require("body-parser")
const sequelize = require('./models/userModel')
const cors=require("cors")
const Userroutes = require('./routes/user')


app.use(express.static("public"))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static('public'))


// app.use(routes)
app.use('/user',Userroutes)

app.listen(4000)
sequelize.sync().then(() => {
    // app.listen(4000)
})