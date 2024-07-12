const express = require('express')
const Category = require('../categories/Category')
const router = express.Router()
const Article = require('./Article')
const slugify = require('slugify')
const adminAuth = require('../middlewares/adminAuth')

router.get('/admin/articles', adminAuth, (req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render('admin/articles/index', {
            articles
        })
    })
})

router.get('/admin/articles/new', adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new', {
            categories
        })
    })
})

router.post('/articles/save', adminAuth, (req, res) => {
    const title = req.body.title
    const body = req.body.body
    const category = req.body.category

    Article.create({
        title,
        slug: slugify(title),
        body,
        categoryId: category,
    }).then(() => {
        res.redirect('/admin/articles')
    })
})

//ROTA PARA DELETAR ARTIGOS
router.post('/articles/delete', adminAuth, (req, res) => {
   const id = req.body.id

   if(id != undefined){
    if(! isNaN(id)){
        Article.destroy({where: {id}}).then(() => {
            res.redirect('/admin/articles')
        })
    }else{
        res.redirect('/admin/articles')
    }
   }else{
    res.redirect('/admin/articles')
   }
})

//ROTA PARA EDITAR
router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
    const id = req.params.id

    if(isNaN(id)){
        res.redirect('/')
    }

    Article.findByPk(id).then(article => {

        if(article != undefined){
            Category.findAll().then(categories => {
                res.render('admin/articles/edit', {
                    article,
                    categories
                })
            })
        }else{
            res.redirect('/')
        }
    }).catch(() => {
        res.redirect('/')
    })
})

//PERSISTIR ALTERAÇÃO NO BD
router.post('/articles/update', adminAuth, (req, res) => {
    const id = req.body.id
    const title = req.body.title
    const body = req.body.body
    const category = req.body.category

    Article.update({title, slug: slugify(title), body, categoryId: category}, {where: {id}}).then(() => {
        res.redirect('/admin/articles')
    }).catch(() => {
        res.redirect('/')
    })
})

router.get('/articles/page/:num', (req, res) => {
   const page = req.params.num
   let offset = 0

   if(isNaN(page) || offset == 1){
    offset = 0
   }else{
    offset = (parseInt(page) -1) * 4
   }

   Article.findAndCountAll({
    limit: 4,
    offset: offset,
    order: [['id', 'DESC']]
   }).then(articles => {

    let next

    if(offset + 4 > articles.count){
        next = false
    }else{
        next = true
    }

    let result = {
        page: parseInt(page),
        next, 
        articles
    }

    Category.findAll().then(categories => {
        res.render('admin/articles/page', {categories, result})
    })

   })
})

module.exports = router