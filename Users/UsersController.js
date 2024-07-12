const express = require('express')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcryptjs')
const adminAuth = require('../middlewares/adminAuth')

router.get('/admin/users', adminAuth, (req, res) => {
    User.findAll().then(users => {
        res.render('admin/users/index', {
            users
        })
    })
})

router.get('/admin/users/create', (req, res) => {
    res.render('admin/users/create')
})

router.post('/users/create', (req, res) => {
    const email = req.body.email
    const password = req.body.password

   User.findOne({where: {email}}).then(user => {
    if(user == undefined){
        let salt = bcrypt.genSaltSync(10)
        let hash = bcrypt.hashSync(password, salt)

        User.create({
            email,
            password: hash
        }).then(() => {
            res.redirect('/')
        }).catch((err) => {
            res.redirect('/')
        })
    }else{
        res.redirect('/admin/users/create')
    }
   })

})


//daqui pra baixo é a parte de autenticação

router.get('/login', (req, res) => {
    res.render('admin/users/login')
})

router.post('/authenticate', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    User.findOne({where: {email}}).then(user => {
        if(user != undefined){

            //validação de senha
            let comparation = bcrypt.compareSync(password, user.password)

            if(comparation){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }

                res.redirect('/admin/articles')
            }else{
                res.redirect('/login')
            }

        }else{
            res.redirect('/login')
        }
    })
})

router.get('/logout', (req, res) => {
    req.session.user = undefined
    res.redirect('/')
})

module.exports = router