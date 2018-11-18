var exceltojson = require("xlsx-to-json-lc");
const mysql = require('mysql');

const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'car_rental'
});

db.connect((err) => {
  if(err){
      throw err;
  } else{

   
 // let sql = 'CREATE TABLE rental_store(rlid int,street VARCHAR(25),zip int, PRIMARY KEY(rlid), FOREIGN KEY(model) REFERENCES is_of(model))';
 let sql = 'CREATE TABLE reservation(resid int,vin VARCHAR(25),licno VARCHAR(25),pickup_date VARCHAR(25),return_date VARCHAR(25),status int,PRIMARY KEY(resid), FOREIGN KEY(vin) REFERENCES car(vin), FOREIGN KEY(licno) REFERENCES customer(license_no))';
  db.query(sql, (err, result) => {
      if(err){
        console.error("error 1 :",err);
      } else{
         exceltojson({
            input:"reservation.xlsx",
            output: null
          }, function(err, result) {
            if(err) {
              console.error("error 2 :",err);
            } else {
        
              for(let i=0;i<result.length;i++){
                let post = result[i];
                let sql = 'INSERT INTO reservation SET ?'; 
                let query = db.query(sql, post, (err, result) => {
                  if(err){
                    console.log("error 3 :",err);
                  } else{
                    console.log(result[i]+" inserted");
                  }
  
        });
        } 
  
        console.log(" done **********************");
    
      }
    });
      }
      
  });
 



  }
  
});






  