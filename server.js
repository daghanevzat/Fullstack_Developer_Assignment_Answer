var express = require("express");
var app = new express();
var server = require("http").Server(app);
var session=require("express-session");

app.use(session({
    secret:"Özel-Anahtar",
    resave: false,
    saveUninitialized: true
}));

var pR= require("./pagereshaper");
pR = new pR("dbkütüphane");

app.use(express.static("public"));

app.set("view engine", "ejs");

function getChecked(req,res){
    if(req.session.kadi != undefined)
    {
        if(req.session.krole==1)
            pageRenderer("admin","admin",res);
        else{
            pR.setUserRequester(req.session);
            pageRenderer("user","user",res);
        }
    }
    else{
        pageRenderer("index","index",res);
    }
}
app.get("/",(req,res)=>{
    getChecked(req,res);
    
});

app.get("/*",(req,res)=>{
    
    //Proje genişlediği takdirde bütün sayfa yönlendirmeleri için yazıldı. yetki kontrolünü destekleyici bir şeyler düşünülmedi.
    // var pagename = req.params[0].split("/");
    // pagename = pagename[pagename.length-1]
    // pageRenderer(pagename,req.params[0],res);
    getChecked(req,res);
})

var degisken = require("body-parser");

app.use(degisken.json());
app.use(degisken.urlencoded({ // url ye daha iyi bir şifreleme yöntemini kullanılması amaclanır.
    extended:true
}))

var posthandler=require("./posthandler");
posthandler= new posthandler();

app.post("/*",(req,res)=>{

    posthandler.handle(req,res,pR);
})

function pageRenderer(pagename,url,res){
    var text = pR.getPageProms(pagename)
    console.log(text);
    if(text == undefined){
        res.render(url);
        return;
    }
    var dataX=[];
    var dataY=[]; // değişken adı promises olarak değiştirilecek.
    text.map(hakki=>{
        dataX.push(hakki[0])
        dataY.push(hakki[1])
    })
    Promise.all(dataY).then(values=>{
        const dict = new Object();
        for (let index = 0; index < values.length; index++) {
            const element = values[index];
            dict[dataX[index]]=element;
        }
        res.render(url, dict);
    })
}

server.on("connection", ()=>{
    console.log("biri girdi");
})

server.listen(33);