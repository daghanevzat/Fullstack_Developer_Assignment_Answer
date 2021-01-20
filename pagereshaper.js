var sqlConnector = require("./mysql");

class pR{
    con;
 
    
    pagedict={
        admin:[["booklist","SELECT * FROM `book` ORDER BY `book`.`bookid` DESC"],["rentedBookList","Select bookid from rent_rel"],["userlist","SELECT * FROM `users`"],["rentList",`select users.userid, users.username, 
        users.user_email, users.user_phone, book.bookid, book.bookname, book.author from book, users, rent_rel where rent_rel.userid = users.userid and rent_rel.bookid = book.bookid`]],
        user:[["booklist","SELECT * FROM `book` ORDER BY `book`.`bookid` DESC"],["rentedBookList","Select bookid from rent_rel"],["rentList",""]]
    }
    constructor(dbname){
        this.con = new sqlConnector(dbname);
    }
    setUserRequester(session)
    {
        //Kullanıcıların ödünç aldıkları kitapları listelemek için sorgunun set edilmesi için yapılmıştır
        this.pagedict["user"][2][1]=`select users.userid, book.bookid, book.bookname, book.author, book.pagenumber 
        from book, users, rent_rel where rent_rel.userid =${session.kid} and users.userid=${session.kid} and rent_rel.bookid = book.bookid`
    }
    getPageProms(pgname){
        var phqueries = this.pagedict[pgname];
        var pageproms = [];
        if(phqueries == undefined){
            pageproms = undefined;
            return pageproms;
        }
        phqueries.map(query =>{
            console.log(query[1])
            pageproms.push([query[0], this.con.runQuery(query[1])])
        })
        return pageproms;
        
    }
    getValidCondition = (kadi,kpass) =>{
        return this.con.runQuery(`select * from users where user_email='${kadi}' and user_pass='${kpass}'`);
    }
    insertBookItem = (books) =>{
        return this.con.runQuery(`INSERT INTO book( bookname, author, pagenumber) VALUES ('${books.kitapadi}','${books.yazaradi}',${books.sayfasayisi})`) 
    }
    insertUser = (user) =>{
        return this.con.runQuery(`INSERT INTO users(user_role, username, user_email, user_pass, user_phone) VALUES (${user.userrole},'${user.username}','${user.useremail}','${user.userpassword}',${user.userphone})`)
    }
    deleteBookItem = (books)=>{
        // her delete işleminde tek tek sql kontrolü yapılıyor. Zaman kısıtlılığından dolayı bilgilerim çerçevesinde yapılmış bir durum olarak optimize edilmesi gerekmektedir.
        return this.con.runQuery(`DELETE FROM book WHERE bookid = ${books}`)
    }
    rentBook = (rBook) =>{
        return this.con.runQuery(`INSERT INTO rent_rel(userid, bookid) VALUES (${rBook.userid}, ${rBook.bookid})`)
    }
    cRBook = (crBook) =>{
        return this.con.runQuery(`DELETE FROM rent_rel WHERE bookid = ${crBook}`)
    }
    updateBook = (uBook) =>{
        console.log(uBook);
        return this.con.runQuery(`UPDATE book SET bookname='${uBook[1]}',author='${uBook[2]}',pagenumber=${uBook[3]} WHERE bookid=${uBook[0]}`)
    }
    getUserInfo=(userId) =>{
        return this.con.runQuery(`Select username, user_email, user_phone from users WHERE userid=${userId}`)
    }
}
module.exports=pR;