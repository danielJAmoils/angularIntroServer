const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')

const app = express()

app.use(session({
    secret: 'asjoifusdauihdashuisdainfijnjignbuisdfuhasdifnnsaddhfhjsji',
    saveUninitialized: false,
    resave: false
}))

mongoose.Promise = Promise
mongoose.connect('mongodb://localhost:27017/angulardb')
.then(() => console.log('Mongoose up'))

const User = require('./models/users')

app.use(bodyParser.json())

app.post('/api/quote', async (req, res) => {
    console.log(req.session.user, req.body.value)
    const user = await User.findOne({email: req.session.user})
    if(!user){
        res.json({
            success: false,
            message: 'Invalid User'
        })
        return
    }

    await User.update({email:req.session.user}, {$set: {quote:req.body.value}})
    res.json({
        success: true
    })
})

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
        req.session.user = email
        req.session.save()

        res.json({
            success: true
        })
    }
})

app.get('/api/isLoggedIn', (req,res) => {
  res.json({
    status: !!req.session.user
  })
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

app.get('/api/data', async (req, res) => {

    const user = await User.findOne({email: req.session.user})

    if(!user){
        res.json({
            status: false,
            message: 'User not found'
        })
        return
    }

    res.json({
        status: true,
        email: req.session.user,
        quote: user.quote
    })
})

app.get('/api/logout', (req, res) => {
    req.session.destroy()
    res.json({
        success: true
    })
})

app.listen(1234, () => {
    console.log("Server started at 1234")
})
