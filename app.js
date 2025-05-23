const express=require('express');
require('dotenv').config();
const cors= require('cors');
const path=require('path');
//database
const charitydb=require('./utils/database');
//routes
const userauthRoutes = require('./routes/userauth');
const charityRoutes=require('./routes/charity');
//models
const usermodel=require('./models/User');
const charitymodel=require('./models/Charities');
const donation=require('./models/donation');
const app=express();

app.use(express.static(path.join(__dirname,'public')));

app.use(cors({
    origin:'*',
    methods:['GET','POST','PUT']
}))

app.use(express.json());
//relations
usermodel.hasMany(charitymodel);
charitymodel.belongsTo(usermodel);
usermodel.hasMany(donation);
donation.belongsTo(usermodel,);
donation.belongsTo(charitymodel, { foreignKey: 'CharityId' });
charitymodel.hasMany(donation, { foreignKey: 'CharityId' });

app.use(userauthRoutes);
app.use(charityRoutes);

async function database(){
    try{
       charitydb.sync({force:false})
       console.log('Database sync successful!');
    }catch(err){
        console.log('Error in database sync',err);
    }
    
}
database();
const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log('Server is listening at port ',PORT);
})