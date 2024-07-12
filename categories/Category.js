const Sequelize = require('sequelize')
const Connection = require('../database/database')

const Category = Connection.define('categories', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

//Category.sync({force: false}).then(() => {})

module.exports = Category