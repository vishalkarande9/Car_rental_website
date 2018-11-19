const mysql = require('mysql');
const _ = require('lodash');
const async = require('async');
var moment = require('moment');

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
    console.log('MySql Connected...');
});


/* get : obj:{
          username:vishal 
}
*/

function get(req, res) { 
    let license_no = req.body.license_no;

    let sql = `SELECT R.rlid,R.street,SC.city,SC.state FROM rental_store R INNER JOIN state_city SC ON R.zip = SC.zip`;
    let query = db.query(sql, (err, result) => {
        if(err){
            console.log(err);
        } else{
           // console.log(result);
            let sql2 = `SELECT type_name from type_info`;
            let query2 = db.query(sql2, (err, result2) => {
                if(err){
                    console.log(err);
                } else{
                    let storeArr=[];
                    let obj={}
                    for(let i=0;i<result.length;i++){
                       storeArr.push({
                           street:result[i].street+","+result[i].city+","+result[i].state,
                           rlid:result[i].rlid
                        }) 
                    }
                    obj={
                        store:storeArr,
                        cartype:result2
                    }

                    res.json(obj);
                }
            })

           // res.send(result);
         //  res.json(result);
        }
        
    });  
}

function check(req, res) {
    
    let license_no = req.body.license_no;
    let StartDate = req.body.pickup_date;
    let ReturnDate = req.body.return_date;
    let rlid = req.body.rlid;
   // let epoc = moment(StartDate).valueOf()
    let StartDatetimeStamp = moment(StartDate, "M/D/YYYY").valueOf();
    StartDate = moment(StartDatetimeStamp);
    let actualStartDateFormat = StartDate.format("M/D/YYYY");
    let ReturnDatetimeStamp = moment(ReturnDate, "M/D/YYYY").valueOf();
     ReturnDate = moment(ReturnDatetimeStamp);
    let actualReturnDateFormat = ReturnDate.format("M/D/YYYY");
  
    let sql = `SELECT * FROM Reservation Where status=1`;
    
    let query = db.query(sql, (err, result) => {
        if(err){
            console.log(err);
        } else{
           //console.log(result);
            
            if(_.some(result, { 'license_no':license_no})){
              let array = _.filter(result, { 'license_no':license_no});
              let flag=true;
              for(let i=0;i<array.length;i++){
                  let pickup_date=moment(array[i]["pickup_date"], "M/D/YYYY").valueOf();
                  let return_date=moment(array[i]["return_date"], "M/D/YYYY").valueOf();
                  if((pickup_date<=StartDate && return_date>=StartDate) || (pickup_date<=ReturnDate && return_date>=ReturnDate) || (pickup_date>=StartDate && return_date<=ReturnDate)){
                      flag = false;
                  } 
              } 
              if(flag){
                  let obj = {code:200,message:"go to next page"};
                  res.json(obj);
              } else{
                let obj = {code:400,message:"date already present in reservation table so no action"};
                res.json(obj);
              }            
            } else{
               let obj={code:200,message:"record not present in Reservation"};
               res.json(obj);

            }

        }
 
    });
    
}

function search(req, res){
    let license_no = req.body.license_no;
    let StartDate = req.body.pickup_date;
    let ReturnDate = req.body.return_date;
    let rlid = req.body.rlid;
   // let epoc = moment(StartDate).valueOf()
    let StartDatetimeStamp = moment(StartDate, "M/D/YYYY").valueOf();
    StartDate = moment(StartDatetimeStamp);
    let actualStartDateFormat = StartDate.format("M/D/YYYY");
    let ReturnDatetimeStamp = moment(ReturnDate, "M/D/YYYY").valueOf();
     ReturnDate = moment(ReturnDatetimeStamp);
    let actualReturnDateFormat = ReturnDate.format("M/D/YYYY");

    let carNotToInclude = ["CS-101"];
     
    let sql1 = `SELECT * FROM Reservation where vin IN (select vin from availability where rlid=${rlid}) AND status=1`;
    
    let query = db.query(sql1, (err, result) => {
        if(err){
          console.log(err); 
        } else{
            let flag=true;
            let vinIdArray=[];
            for(let i=0;i<result.length;i++){
                let pickup_date=moment(result[i]["pickup_date"], "M/D/YYYY").valueOf();
                let return_date=moment(result[i]["return_date"], "M/D/YYYY").valueOf();
                if((pickup_date<=StartDate && return_date>=StartDate) || (pickup_date<=ReturnDate && return_date>=ReturnDate) || (pickup_date>=StartDate && return_date<=ReturnDate)){
                    flag=false;
                } else{
                    vinIdArray.push(result[i].vin);
                }
            }
            if(vinIdArray.length>0){
                let tableArray=[];
                async.each(vinIdArray, function(item, callback) {
                    let sql2 = `SELECT C.model, I.type_name, T.rate_per_day, T.capacity From Car C, is_of I, type_info T Where C.vin='${item}' AND C.model=I.model AND I.type_name=T.type_name`;
                    let query =db.query(sql2,(err,result2) => {
                        if(err){
                            console.log(err);
                            callback();
                        } else{
                            console.log(result2[0],"%%%%%%%%%%%%%%%%%%");
                            tableArray.push(result2[0]);
                            callback();
                          
                        }

                    })
                }, function(err) {
                    res.json({code:200,message:"cars found",data:tableArray})
                })
            
  

            } else{
                res.json({code:400,message:"no cars found"})
            }

        //  res.json(result);
        }
 
    })
    


}



module.exports.search = search 
module.exports.get = get 
module.exports.check = check 