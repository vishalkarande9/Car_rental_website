const mysql = require('mysql');
const _ = require('lodash');
const async = require('async');
var moment = require('moment');
const uuid = require('uuid/v1');


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



function getCar(req, res) { 
    let rlid  = req.body.rlid ;

    let sql = `SELECT vin FROM availability Where rlid =${rlid}`;
    let query = db.query(sql, (err, result) => {
        if(err){
            console.log(err);
        } else{
            let finalCarArr=[];
            async.each(result, function(item, callback) {

             let sql = `SELECT * FROM car Where vin ='${item.vin}'`;
             let query = db.query(sql, (err, result) => {
                 if(err){
                    console.log(err);
                    callback()

                 } else{
                    finalCarArr.push(result[0]);
                    callback()
                 }
             })
            }, function(err){
                let obj={
                    "code":200,
                    "message":"got cars",
                    "data":finalCarArr
        
                } 
                res.json(obj);
            })

        }
        
    });  
}

function viewCar(req, res) { 
    let rlid  = req.body.rlid ;

    let sql = `SELECT C.vin, C.model FROM Car C, availability A Where C.vin= A.vin And A.rlid =${rlid}`;
    let query = db.query(sql, (err, result) => {
        if(err){
            console.log(err);
        } else{
            if(result.length>0){
                let obj={
                    "code":200,
                    "message":"got cars",
                    "data":result
        
                } 
                res.json(obj);
            } else{
                let obj={
                    "code":400,
                    "message":"no cars available"
        
                } 
                res.json(obj);
            }
           

        }
        
    });  
}

function getrlid(req, res) { 
    let emailId  = req.body.emailId ;

    let sql = `SELECT rlid FROM manager Where emailId ='${emailId}'`;
    let query = db.query(sql, (err, result) => {
        if(err){
            console.log(err);
        } else{
        let rlid = result[0].rlid;
        let sql2 = `SELECT model FROM model `;
        let query = db.query(sql2, (err, result2) => {
            if(err){
                console.log(err);
            } else{
                let sql3 = `SELECT type_name FROM type_info `;
                let query = db.query(sql3, (err, result3) => {
                    if(err){
                        console.log(err);
                        let obj={
                            "code":400,
                            "message":"error in getting rlid, modelArr, type_nameArr"
                        } 
                        res.json(obj);
                    } else{
                        let obj={
                            "code":200,
                            "message":"got rlid , model, type_name",
                            "data":{
                                "rlid":rlid,
                                "modelArr":result2,
                                "type_nameArr":result3
                            }
                
                        } 
                        res.json(obj);
                    }
                })

            }
        })
     
        }
        
    });  
}

function addCar(req, res) { 
    let vin = uuid();
    vin = vin.split("-").join("");
    let model = req.body.model;
    let year = req.body.year;
    let rlid = req.body.rlid;
  
    let sql = `Insert into car values ('${vin}','${model}',${year})`;
    let query = db.query(sql, (err, result) => {
        if(err){
            console.log(err);
        } else{
     
           let sql1 = `Insert into availability values ('${vin}',${rlid})`;
           let query = db.query(sql1, (err, result) => {
            if(err){
                console.log(err);
                let obj={
                    "code":400,
                    "message":"Cannot add new car "
                } 
                res.json(obj);
            } else{
                let obj={
                    "code":200,
                    "message":"new car inserted"
                } 
                res.json(obj);
            }

           })

        }
        
    });  
}

function deleteCar(req, res) { 
    let vin  = req.body.vin ;

    let sql = `DELETE FROM car Where vin ='${vin}'`;
    let query = db.query(sql, (err, result) => {
        if(err){
            console.log(err);
            let obj={
                "code":400,
                "message":"error in deleting car"
            } 
            res.json(obj);
        } else{
        let obj={
            "code":200,
            "message":vin+" deleted"
        } 
        res.json(obj);
    
        }
        
    });  
}

function admingetcar(req, res) { 

    let sql = `Select C.model, sum(total_amount) As profits From payment P, reservation R , car C Where P.status=1 And R.resid=P.resId And R.vin=C.vin Group By C.model Order By profits Desc `;
    let query = db.query(sql, (err, result) => {
        if(err){
            console.log(err);
        
        } else{
            if(result.length>0){
                let obj={
                    "code":200,
                    "message":"got cars",
                    "data":result
                } 
                res.json(obj);
            } else{
                let obj={
                    "code":400,
                    "message":"no cars found"
                } 
                res.json(obj);
            }
  
    
        }
        
    });  
}

function admingetstore(req, res) { 

    let sql = `Select RS.street, sum(total_amount) As profits From payment P, reservation R , availability A, rental_store RS Where P.status=1 And R.resid=P.resId And R.vin=A.vin And A.rlid=RS.rlid Group By RS.street Order By profits Desc `;
    let query = db.query(sql, (err, result) => {
        if(err){
            console.log(err);
        
        } else{
            console.log("result :",result);
            if(result.length>0){
                let obj={
                    "code":200,
                    "message":"got stores",
                    "data":result
                } 
                res.json(obj);
            } else{
                let obj={
                    "code":400,
                    "message":"no stores found"
                } 
                res.json(obj);
            }
  
    
        }
        
    });  
}

function getuser(req, res) { 

    let sql = `Select emailId , user_key from user `;
    let query = db.query(sql, (err, result) => {
        if(err){
            console.log(err);
        
        } else{
            console.log("result :",result);
            if(result.length>0){
                let obj={
                    "code":200,
                    "message":"got users",
                    "data":result
                } 
                res.json(obj);
            } else{
                let obj={
                    "code":400,
                    "message":"no users found"
                } 
                res.json(obj);
            }
  
    
        }
        
    });  
}

function deleteuser(req, res) { 
    let emailId  = req.body.emailId ;

    let sql = `Delete From user where emailId='${emailId}'`;
    let query = db.query(sql, (err, result) => {
        if(err){
            console.log(err);
        
        } else{
                let obj={
                    "code":200,
                    "message":"user deleted"
                                } 
                res.json(obj);
  
    
        }
        
    });  
}

module.exports.deleteuser = deleteuser
module.exports.admingetcar = admingetcar
module.exports.admingetstore = admingetstore
module.exports.viewCar = viewCar
module.exports.addCar = addCar 
module.exports.getrlid = getrlid
module.exports.deleteCar = deleteCar 
module.exports.getCar = getCar 
module.exports.getuser = getuser
