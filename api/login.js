const mysql = require('mysql');
const _ = require('lodash');

// Create connection
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '', 
    database : 'dbms_project'
});

// Connect
db.connect((err) => {
    if(err){
        throw err; 
    }
    console.log('MySql Connected... $$$$$$$$$$$$$$$$$$$$$$$');
});



function auth(req, res) { 
   let emailId = req.body.emailId;
   let password = req.body.password;
   let usertype = req.body.usertype;


    let sql = `SELECT emailId FROM user Where emailId ='${emailId}' AND password ='${password}' AND user_key =${usertype}`;
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
                    "message":"Invalid user, Please register"
                } 
                res.json(obj);
            }    
        }
        
    });  
}




module.exports.auth = auth 
