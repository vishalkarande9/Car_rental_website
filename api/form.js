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
    console.log('MySql Connected...');
});

function viewreservation(req,res) {
    let license_no = req.body.license_no;
    let sql = `SELECT R.resid, RS.street, R.pickupdate, R.returndate, C.model From reservation R, Availability A, Car C, rental_store RS Where R.license_no = ${license_no} And R.vin = A.vin And R.vin = C.vin And RS.rlid = A.rlid And R.status=1`;
    let query = db.query(sql, (err, result) => { 
        if(err){
            console.log(err);
    
        } else{
            if(result.length>0){
                obj={
                    'code':200,
                    'message':"View Reservations",
                    'data':result
                }
    
                res.json(obj);
            } else{
                obj={
                    'code':400,
                    'message':"No Reservations Found"
                }
    
                res.json(obj);
            }
      
        }
    })
}

function cancelreservation(req,res) {
    let resid = req.body.resid;
    let sql = `Update reservation Set status = 0 Where resid=${resid}`;
    let query = db.query(sql, (err, result) => { 
        if(err){
            console.log(err);
    
        } else{
            let sql1 = `Update payment Set status = 0 Where resid=${resid}`;
            let query = db.query(sql1, (err, result) => { 
                if(err){
                    console.log(err);
            
                } else{
                    obj={
                        'code':200,
                        'message':"Reservation canceled"
                    }
        
                    res.json(obj);
                }
            })
      
        }
    })
}




function get(req, res) { 
    let emailId = req.body.emailId;
  //  console.log(emailId);
    let sql = `SELECT R.rlid,R.street,SC.city,SC.state FROM rental_store R INNER JOIN state_city SC ON R.zip = SC.zip`;
    let query = db.query(sql, (err, result) => {
        if(err){
            console.log(err);
        } else{
            let sql2 = `SELECT type_name from type_info`;
            let query2 = db.query(sql2, (err, result2) => {
                if(err){
                    console.log(err);
                    obj={
                        'code':400,
                        'message':"error in getting cartype and store"
                    }

                    res.json(obj);
                } else{
                    let storeArr=[];
                    let obj={};
                    /*
                    for(let i=0;i<result.length;i++){
                       storeArr.push({
                           street:result[i].street+","+result[i].city+","+result[i].state,
                           rlid:result[i].rlid
                        }) 
                    }
                    */
             

                    async.each(result, function(item, callback) {
                        storeArr.push({
                            street:item.street+","+item.city+","+item.state,
                            rlid:item.rlid
                         });
                         callback() 

                    }, function(){
                        let sql3 = `SELECT license_no from customer WHERE emailId='${emailId}'`;
                        let query2 = db.query(sql3, (err, result3) => {
                            if(err){
                                console.log(err);
                                obj={
                                    'code':400,
                                    'message':"error in getting cartype and store and license_no"
                                }
            
                                res.json(obj);
                            } else{
                                
                                obj={
                                    'code':200,
                                    'message':"all store and models",
                                    'store':storeArr,
                                    'cartype':result2,
                                    'license_no':result3[0].license_no
                                }
            
                                res.json(obj);
                            }
                        })

                    })
                }
            })

        }
        
    });  
}

function check(req, res) {
    
    let license_no = req.body.license_no;
    let StartDate = req.body.pickupdate;
    let ReturnDate = req.body.returndate;
    let rlid = req.body.rlid;
    let StartDatetimeStamp = moment(StartDate, "M/D/YYYY").valueOf();
    StartDate = moment(StartDatetimeStamp);
    let actualStartDateFormat = StartDate.format("M/D/YYYY");
    let ReturnDatetimeStamp = moment(ReturnDate, "M/D/YYYY").valueOf();
     ReturnDate = moment(ReturnDatetimeStamp);
    let actualReturnDateFormat = ReturnDate.format("M/D/YYYY");
  
    let sql = `SELECT * FROM Reservation Where status=1`;
    
    let query = db.query(sql, (err, result) => {
        let emailId = req.body.emailId;
        if(err){
            console.log(err);
        } else{
           license_no = parseInt(license_no);
           
            if(_.some(result, {'license_no':license_no})){
              let array = _.filter(result, {'license_no':license_no});
              let flag=true;
              for(let i=0;i<array.length;i++){
                  let pickup_date=moment(array[i]["pickupdate"], "M/D/YYYY").valueOf();
                  let return_date=moment(array[i]["returndate"], "M/D/YYYY").valueOf();
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
    let StartDate = req.body.pickupdate;
    let ReturnDate = req.body.returndate;
    let rlid = req.body.rlid;
    let type_name = req.body.type_name;
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
                let pickup_date=moment(result[i]["pickupdate"], "M/D/YYYY").valueOf();
                let return_date=moment(result[i]["returndate"], "M/D/YYYY").valueOf();
                if((pickup_date<=StartDate && return_date>=StartDate) || (pickup_date<=ReturnDate && return_date>=ReturnDate) || (pickup_date>=StartDate && return_date<=ReturnDate)){
                    vinIdArray.push(result[i].vin);
                } else{
                    flag=false;
                }
            }

            let sql2 = `SELECT A.vin FROM availability A, car C, model M where rlid=${rlid} AND A.vin = C.vin AND C.model = M.model AND M.type_name='${type_name}'`;
            let query = db.query(sql2, (err,result2) => {
                if(err){
                    console.log(err);
                } else{
                    let AllvinArr=[];
                    for(let i=0;i<result2.length;i++){
                        AllvinArr.push(result2[i].vin);
                    }
                    vinIdArray =  _.difference(AllvinArr, vinIdArray); 
                    if(vinIdArray.length>0){
                        let tableArray=[];
                        async.each(vinIdArray, function(item, callback) {
                            let sql2 = `SELECT C.vin, C.model, I.type_name, T.rate_per_day, T.capacity From Car C, model I, type_info T Where C.vin='${item}' AND C.model=I.model AND I.type_name=T.type_name`;
                            let query =db.query(sql2,(err,result3) => {
                                if(err){
                                    console.log(err);
                                    callback();
                                } else{
                                 //   console.log(result3[0],"%%%%%%%%%%%%%%%%%%");
                                    tableArray.push(result3[0]);
                                    callback();
                                  
                                }
        
                            })
                        }, function(err) {

                                 let stdate = req.body.pickupdate;
                                 let rtdate = req.body.returndate;
                                 let start = moment(stdate, "M/D/YYYY");
                                 let end = moment(rtdate, "M/D/YYYY");

                                //Difference in number of days
                                let days = moment.duration(end.diff(start)).asDays();
                                res.json({code:200,message:"cars found",data:tableArray,days:days})
                        })
                    
          
        
                    } else{
                        res.json({code:400,message:"no cars found"})
                    }
                }

            })


        }
 
    })
    
}

function book(req, res) { 
    let vin =req.body.vin;
    let license_no =req.body.license_no;
    let pickupdate =req.body.pickupdate;
    let returndate =req.body.returndate;
    let total_amount = req.body.total_amount;
    let resid = moment().unix();
    let sql1 = `Insert into reservation values (${resid},'${vin}',${license_no},'${pickupdate}','${returndate}',1)`;
    let query2 = db.query(sql1, (err, result) => {
        if(err){
            obj={
                'code':400,
                'message':"cannot insert values"
            }

            res.json(obj);
        } else{
            let sql2 = `Insert into payment values (${resid},${total_amount},1)`;
            let query2 = db.query(sql2, (err, result) => {
                if(err){
                    obj={
                        'code':400,
                        'message':"cannot insert values"
                    }
        
                    res.json(obj);
                } else{
                    obj={
                        'code':200,
                        'message':"booking done"
                    }
        
                    res.json(obj);
                }
            })

     
        }
    })

}

module.exports.cancelreservation = cancelreservation
module.exports.viewreservation = viewreservation
module.exports.book = book 
module.exports.search = search 
module.exports.get = get 
module.exports.check = check 