class postHandler{
    handle(req,res,pR){
        
        if(req.params[0] == "quit"){
            req.session.destroy();
            res.end();
        }

        else if(req.params[0]=="InsertBook"){
            var result=pR.insertBookItem(req.body);
            result.then(values=>{
                console.log(values);
                res.send({cond:"1", bookid: values.insertId});
            })
        }

        else if(req.params[0]== "InsertUsers"){
            var userResult = pR.insertUser(req.body);
            userResult.then(values=>{
                console.log(values);
                res.end("1");
            })
        }

        else if(req.params[0]== "deleteBookItem"){
            this.deleteHandler(req,res,pR.deleteBookItem)
        }

        else if(req.params[0]== "rentBook"){
            if(req.body.userid==-1){
                req.body.userid=req.session.kid;
            }
            var rentBooks = pR.rentBook(req.body);
            rentBooks.then(values=>{
                console.log(values);
                res.end("1");
            })
        }

        else if(req.params[0] == "CancelRentBook"){
            this.deleteHandler(req,res,pR.cRBook)
        }

        else if(req.params[0] == "AdminCancelRentBook"){
            this.deleteHandler(req,res,pR.cRBook)
        }

        else if(req.params[0] == "updateBook"){
            console.log(req.body);
            var userResult = pR.updateBook(req.body);
            userResult.then(values=>{
                console.log(values);
                res.end("-1");
            }).catch(err =>{
                res.end("1");
            })
        }
                
        else if(req.params[0]=="getuserId"){
            var userResult = pR.getUserInfo(req.body.userid);
            userResult.then(values=>{
                console.log(values);
                res.send(values)
            })
        }

        else{
            /* Kullanıcı rolleri belirlendikten sonra sessiona kaydedilir. */
            var body = req.body;
            var result = pR.getValidCondition(body.kadi, body.kpass);
            result.then((value)=>{
                if(value.length != 0){
                    console.log(value);
                    if(value[0].user_role == 1){
                        req.session.kadi=value[0].user_email;
                        req.session.krole=1
                        req.session.kid=value[0].userid;
                        res.end("1");
                    }else{
                        req.session.kadi=value[0].user_email;
                        req.session.krole=0;
                        req.session.kid=value[0].userid;
                        res.end("0");
                    }
                }
                else{
                    res.end("Giriş İşlemi Başarısız!!");
                }
            })
        }
    }
     deleteHandler(req,res,queryfunc){
         
        var bookids=req.body;
            var proms=[]
            for(var i =0; i<bookids.length;i++){
                proms.push(queryfunc(parseInt(bookids[i])));
            }
            Promise.all(proms).then(values=>{
                res.end("-1");
            }).catch(error=>{
                var sql = error.sql;
                sql = sql.substring(sql.indexOf("=") + 1);
                res.end(sql);
            })
    }
}
module.exports=postHandler;