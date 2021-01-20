var mysql = require("mysql");

class sqlConnector{
    con;
    constructor (dbname){
        this.con = mysql.createConnection({
            host:"localhost",
            user:"root",
            password:"",
            database:dbname            
        });
        this.con.connect();
    }
    runQuery(query){
        return new Promise((res,rej)=>{
            this.con.query(query,(err,result,fields)=>{
                if(err) rej(err);
                res(result);
            });
        })
    }
}
module.exports = sqlConnector; //export etmekteki amaç farklı dosyalarla alakalı kodları yazarken uzantıya erişebilmek.