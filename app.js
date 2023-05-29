const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');   

//const errorController = require('./controllers/error');

const sequelize = require('./util/database');


var cors = require('cors');

const app = express();

app.use(cors());


const userRoutes = require('./routes/user');    


app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));  

app.use('/user', userRoutes);



// app.use(errorController.get404);

sequelize 
  .sync({force:false}) 
  .then(result => {
    // console.log(result);
    app.listen(4000);
})
.catch(err => {
    console.log(err);
});