const mysql = require('mysql');
const _ = require('lodash');

// Create connection
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'homework2'
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
    let username = req.body.username;

    let sql = `SELECT * FROM Customer WHERE name = ${username}`;
    let query = db.query(sql, (err, result) => {
        if(err){
            console.log(err);
        } else{
            console.log(result);
           // res.send(result);
           res.json(result);
        }
        
    });  
}

function check(req, res) {
    
    let License = req.body.License;
    let StartDate = req.body.StartDate;
    let ReturnDate = req.body.ReturnDate;
    

    console.log("request :",req.body);
    let sql = `SELECT * FROM Reservation`;
    
    let query = db.query(sql, (err, result) => {
        if(err){
            console.log(err);
        } else{
         //   console.log(result);

            if(_.some(result, { 'License':License})){
              let array = _.filter(result, { 'License':License});
              let flag=true;
              for(let i=0;i<array.length;i++){
                  if((array[i]["StartDate"]<=StartDate && array[i]["ReturnDate"]>=StartDate) || (array[i]["StartDate"]<=ReturnDate && array[i]["ReturnDate"]>=ReturnDate)){
                      flag = false;
                  } 
              } 
              if(flag){
                  let obj = {code:200,message:"go to next page"};
                  res.json(obj);
              } else{
                let obj = {code:400,message:"no action"};
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
   // let StartDate = req.body.StartDate;
   // let ReturnDate = req.body.ReturnDate;
    let carNotToInclude = ["CS-101"];
     
    let sql1 = `SELECT * FROM Reservation`;
    /*
    let query = db.query(sql1, (err, result) => {
        for(let i=0;i<result.length;i++){
            if((result[i]["StartDate"]<=StartDate && result[i]["ReturnDate"]>=StartDate) || (result[i]["StartDate"]<=ReturnDate && result[i]["ReturnDate"]>=ReturnDate)){
                carNotToInclude.push(result[i]["VIN"])
            }
        }
    })
    */
   
    let sql2 =  `SELECT * FROM student inner join takes On student.ID=takes.ID`;
    let query = db.query(sql2, (err, result) => {
        if(err){
            console.log(err);
        } else{
           let newArr= _.filter(result, (v) => !_.includes(carNotToInclude, v.course_id));
        
          // console.log(newArr);
           res.json(result.length);
        }
        
    })

}

module.exports.search = search 
module.exports.get = get 
module.exports.check = check 