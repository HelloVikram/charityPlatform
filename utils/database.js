const Sequelize=require('sequelize');

const charitydb=new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
    dialect:'mysql',
    host:process.env.HOST
})
module.exports=charitydb;
