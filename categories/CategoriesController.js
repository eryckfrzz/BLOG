const express = require('express')
const router = express.Router()
const Category = require('./Category')
const slugify = require('slugify')
const adminAuth = require('../middlewares/adminAuth')

router.get('/admin/categories/new', adminAuth, (req, res) => {
    res.render('admin/categories/new')
})

router.post('/categories/save', adminAuth, (req, res) => {
    const title = req.body.title

    if(title != undefined){
        Category.create({
            title,
            slug: slugify(title)
        }).then(() => {
            res.redirect('/admin/categories')
        })
    }else{
        res.redirect('/admin/categories/new')
    }
})

router.get('/admin/categories', adminAuth, (req, res) => {
   Category.findAll().then(categories => {
        res.render('admin/categories/index', {
            categories
        })
   })
})

//ROTA PARA DELETAR
router.post('/categories/delete', adminAuth, (req, res) => {
    const id = req.body.id

    if(id != undefined){
        if(! isNaN(id)){
            Category.destroy({where: {id}}).then(() => {
                res.redirect('/admin/categories')
            })
        }else{
            res.redirect('/admin/categories')
        }
    }else{
        res.redirect('/admin/categories')
    }
})

router.get('/admin/categories/edit/:id', adminAuth, (req, res) => {
    const id = req.params.id

    if(isNaN(id)){
        res.redirect('/admin/categories')
    }
    
    Category.findByPk(id).then(category => {
        if(category != undefined){
            res.render('admin/categories/edit', {
                category
            })
        }else{
            res.redirect('/admin/categories')
        }
    }).catch(() => {
        res.redirect('/admin/categories')
    })
})

router.post('/categories/update', adminAuth, (req, res) => {
    const id = req.body.id
    const title = req.body.title

    Category.update({title, slug: slugify(title)}, {where: {id}}).then(() => {
        res.redirect('/admin/categories')
    })
})

module.exports = router