const express = require('express');
const routes = require('./utils/routes');
const app = express();
const cors = require('cors');
var bodyParser = require('body-parser');



app.use(bodyParser.json());
app.use(cors()); 
app.use('/api/',routes); 
 

app.listen('9000', () => {
    console.log('Server started on port 9000');
}); 