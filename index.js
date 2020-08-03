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
        console.log('Incorrect details')
        //user login is incorrect 
    }else{
        console.log('Logging you in')
        //make a session and set user to logged in
    }
    res.send('k')
})

app.post('/api/register', async (req, res) => {
    const {email, password} = req.body
    const user = new User({
        email,
        password
    })

    const result = await user.save()
    console.log(result)

    res.json(result)
})

app.listen(1234, () => {
    console.log("Server started at 1234")
})