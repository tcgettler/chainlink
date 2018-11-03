const express = require('express');
const path = require('path');

const app = express();

var PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


require('./routes/api-routes.js')(app);
require('./routes/html-routes.js')(app);

const db = require('./models');

db.sequelize.sync().then(function() {
    app.listen(PORT, function(){
        console.log("Listening on Port: "+ PORT);
    });
});