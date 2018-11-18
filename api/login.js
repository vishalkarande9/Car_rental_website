const mysql = require('mysql');
const _ = require('lodash');

// Create connection
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'car_rental'
});

// Connect
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Connected... $$$$$$$$$$$$$$$$$$$$$$$');
});



function auth(req, res) { 
    let licenseNo = req.body.license_no;
    console.log("I am here $$$$$$$$$$$$$$$$$$$$$$$$");
   // let password = req.body.password;

    let sql = `SELECT license_no FROM Customer Where license_no =${licenseNo}`;
    let query = db.query(sql, (err, result) => {
        if(err){
            console.log(err);
        } else{
            if(result.length>0){
              let obj={
                  "code":200,
                  "message":"valid user"
              } 
              res.json(obj);

            } else{
                let obj={
                    "code":400,
                    "message":"Invalid user"
                } 
                res.json(obj);
            }



           // res.send(result);
    
        }
        
    });  
}




module.exports.auth = auth 
