const bodyParser = require('body-parser')
const express = require('express')
const Connection = require('./database/database')
const session = require('express-session')
const app = express()

const CategoriesController = require('./categories/CategoriesController')
const ArticlesController = require('./articles/ArticlesController')
const UsersController = require('./Users/UsersController')

const Article = require('./articles/Article')
const Category = require('./categories/Category')
const User = require('./Users/User')

//view engine
app.set('view engine', 'ejs')

//session
app.use(session({
    secret: 'asdfghjkl',
    cookie: {maxAge: 30000}
}))

//static arquives
app.use(express.static('public'))

//body-parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

Connection
    .authenticate()
    .then(() => {
        console.log('conexão feita com sucesso ao banco de dados!')
    })
    .catch((msgerror) => {
        console.log(msgerror)
    })

app.use('/', CategoriesController)
app.use('/', ArticlesController)
app.use('/', UsersController)

// app.get('/session', (req, res) => {
//    req.session.nome = 'Ana',
//    req.session.idade = '16'

//    res.send('sessão criada a partir de agora!')
// })

// app.get('/leitura', (req, res) => {
//     res.json({
//         nome: req.session.nome,
//         idade: req.session.idade
//     })
// })

app.get('/:slug', (req, res) => {
    const slug = req.params.slug

    Article.findOne({where: {slug}}).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render('article', {
                    categories,
                    article
                })
            })
        }else{
            res.redirect('/')
        }
    }).catch(() => {
        res.redirect('/')
    })
})

app.get('/', (req, res) => {
    Article.findAll({
        order: [['id', 'DESC']],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', {
                articles,
                categories
            })
        })
    })
})

app.get('/category/:slug', (req, res) => {
    const slug = req.params.slug

    Category.findOne({where: {slug}, include: [{model: Article}]}).then(category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render('index', {
                    articles: category.articles,
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

app.listen(8080, () => {
    console.log('servidor iniciado na porta 8080!')
})