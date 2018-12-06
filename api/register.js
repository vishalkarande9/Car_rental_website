const mysql = require('mysql');
const _ = require('lodash');
const async = require('async');
var moment = require('moment');


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



function registerCustomer(req, res) { 
    let emailId  = req.body.emailId ;
    let password = req.body.password ;
    let license_no = req.body.license_no ;
    let name = req.body.name ;
    let street = req.body.street ;
    let zip = req.body.zip ;


   // let password = req.body.password;

    let sql = `SELECT emailId FROM user Where emailId ='${emailId}'`;
    let query = db.query(sql, (err, result) => {
        if(err){
            console.log(err);
        } else{
            if(result.length>0){
              let obj={
                  "code":400,
                  "message":"Customer already exists"
              } 
              res.json(obj);

            } else{
              let sql1 = `Insert into user values ('${emailId}','${password}',2)`;  
              let query = db.query(sql1, (err, result) => {
                  if(err){
                    console.log(err);
                  } else{
                    let sql2 = `Insert into customer values (${license_no},'${name}','${emailId}','${street}',${zip})`; 
                    let query = db.query(sql2, (err, result) => { 
                        if(err){
                            console.log(err);
                        } else{
                            let obj={
                                "code":200,
                                "message":"Customer add"
                            } 
                            res.json(obj);
                        }
                    })
                  }
              })
            }
    
        }
        
    });  
}

function registerManager(req, res) { 
    let emailId  = req.body.emailId ;
    let password = req.body.password ;
    let rlid = req.body.rlid ;
    let name = req.body.name ;
   // let password = req.body.password;

    let sql = `SELECT emailId FROM user Where emailId ='${emailId}'`;
    let query = db.query(sql, (err, result) => {
        if(err){
            console.log(err);
        } else{
            console.log(result)
            if(result.length>0){
              let obj={
                  "code":400,
                  "message":"Manager already exists"
              } 
              res.json(obj);

            } else{
              let sql1 = `Insert into user values ('${emailId}','${password}',1)`;  
              let query = db.query(sql1, (err, result) => {
                  if(err){
                    console.log(err);
                
                  } else{
                    let sql2 = `Insert into manager values ('${emailId}',${rlid},'${name}')`; 
                    let query = db.query(sql2, (err, result) => { 
                        if(err){
                            console.log(err);
                            let obj={
                                "code":400,
                                "message":"Manager already existshhhhhhhh"
                            } 
                            res.json(obj);
                        } else{
                            let obj={
                                "code":200,
                                "message":"Manager add"
                            } 
                            res.json(obj);
                        }
                    })
                  }
              })
            }
    
        }
        
    });  
}



module.exports.registerManager = registerManager 
module.exports.registerCustomer = registerCustomer 
