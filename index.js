const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

mongoose.Promise = Promise
mongoose.connect('mongodb://localhost:27017/angulardb')
.then(() => console.log('Mongoose up'))

const User = require('./models/users')

const app = express()

app.use(bodyParser.json())

app.post('/api/login', async (req, res) => {
    const {email, password} = req.body

    console.log(email,password)

    const resp = await User.findOne({email, password})

    if(!resp){
        res.json({
            success: false,
            message: "Incorrect details"
        }) 
    }else{
        console.log('Logging you in')
        res.json({
            success: true
        }) 
    }
})

app.post('/api/register', async (req, res) => {
    const {email, password} = req.body

    const existingUser = await User.findOne({email})

    if(existingUser){
        res.json({
            success: false,
            message: "Email already in use"
        })
        return
    }

    const user = new User({
        email,
        password
    })

    const result = await user.save()
    console.log(result)

    res.json({
        success: true,
        message: "Welcome! User created"
    })
})

app.listen(1234, () => {
    console.log("Server started at 1234")
})