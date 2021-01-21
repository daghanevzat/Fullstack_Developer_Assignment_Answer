var dispflag=-2
function show(cbindex){ //card-body index
    if(cbindex == -2 ){
        bodys=document.getElementsByClassName("card-body anim-in")
            for (let index = 0; index < bodys.length; index) {
                const element = bodys[index];
                element.setAttribute("class","card-body")
                element.setAttribute("style","");
            }
        dispflag=-2;
    }
    else{
        if (dispflag!=-2)
    {
        var exrow=document.getElementsByClassName('card row')[dispflag];
        var exbody=exrow.getElementsByClassName('card-body anim-in')[0];
    }
    var row=document.getElementsByClassName('card row')[cbindex];
    var body=row.getElementsByClassName('card-body')[0];
    body.setAttribute("class","card-body anim-in");
    body.setAttribute("style","max-height: 2000px;opacity: 1;");
    dispflag=cbindex;
    }
}


function showSearchBox(index){
    var searchBox = document.getElementsByName("searchBox")[index];
    var searchBoxControlled=searchBox.style.display;
    if(searchBoxControlled.length != 0){
        searchBoxControlled = "";
    }
    else{
        searchBoxControlled = "None";
    }
    searchBox.style.display=searchBoxControlled;
}
function sendquitreq(){
    axios({
        method:"post",
        url:"quit",
    })
}

function sendInsertBook(form){
    var inputs = form.getElementsByTagName("input");
    axios({
        method:"post",
        url:"InsertBook",
        data:{kitapadi:inputs[0].value, yazaradi:inputs[1].value, sayfasayisi:inputs[2].value}
    }).then(answer=>{
        if(answer.data.cond == 1)
        {
        alert("Ekleme İşlemi Başarılı..");

        var row = document.createElement("tr");
        for(var i =0; i<4;i++)
        {
            row.insertCell(0);
        }
        row.cells[0].innerHTML = `<div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="${answer.data.bookid}" >
                                    <label class="form-check-label" for="flexCheckChecked">
                                    </label>
                                    
                                    </div>`
        row.cells[1].innerHTML = inputs[0].value;
        row.cells[2].innerHTML = inputs[1].value;
        row.cells[3].innerHTML = inputs[2].value;
        var tbody = document.getElementsByTagName("tbody")[0];
        tbody.insertRow(0);
        tbody.rows[0].innerHTML= row.innerHTML;
        tbody = document.getElementsByTagName("tbody")[1];
        var condcell=row.insertCell(-1);
        condcell.innerHTML("Alınmamış")
        tbody.insertRow(0);
        tbody.rows[0].innerHTML= row.innerHTML;
    }
    });
}
function deleteBook(){
    var tbody=document.getElementsByTagName("tbody")[0];
    var tbody1=document.getElementsByTagName("tbody")[1];
    var checkList = tbody.getElementsByTagName("input");
    var checkedList = [];
    var selectedrow=[];
    for(var i = 0; i<checkList.length; i++){
        if(checkList[i].checked){
            checkedList.push(checkList[i].id);
            selectedrow.push(checkList[i].parentNode.parentNode.parentNode);
        }
    }
    axios({
        method:"post",
        url:"deleteBookItem",
        data: checkedList
    }).then(answer=>{
        if(answer.data == -1) 
        {
        alert("Kitap Silme İşlemi Başarılı..");
        for( var i=0 ; i<selectedrow.length;i++){
            var delIndex = selectedrow[i].rowIndex-1;
            tbody.deleteRow(delIndex);
            tbody1.deleteRow(delIndex);
        }
        }
        else{
            alert(answer.data + " Numaralı Kitap Daha Önce Kiralanmıştır..");
        }
    });
}

/*Kitap kiralama işlemlerinin yapılmasını için yazıldı.
Hem admin hem kullanıcı ortak bir şekilde kullanıyor. */
function rentBook(form,userflag=false){
    var bookList = form.getElementsByTagName("tbody")[0];
    var userList = form.getElementsByTagName("tbody")[1];
 
    var userCheckId = -1;
    if(!userflag){
        var userCheckList = userList.getElementsByTagName("input");
        for(var temp=0;temp<userCheckList.length;temp++){
            if(userCheckList[temp].checked){
                if(userCheckId != -1){
                    alert("Birden Fazla Kullanıcı Seçilemez..")
                    break;
                }
                else{
                    userCheckId = userCheckList[temp].id;
                }
            }
        }
    }
    var bookCheckList = bookList.getElementsByTagName("input");
    var bookCheckedRowList=[]
    var bookCheckedidList=[];
    
    for(var ar=0;ar<bookCheckList.length;ar++){
        if(bookCheckList[ar].checked){
            bookCheckedRowList.push(bookCheckList[ar].parentNode.parentNode.parentNode)
            bookCheckedidList.push(bookCheckList[ar].id);
        }
    }
    axios({
        method:"post",
        url:"rentBook",
        data:{userid:userCheckId, bookid:bookCheckedidList}
    }).then(answer=>{
        if(answer.data == 1){
             alert("Kitap Kiralama İşlemi Başarılı..");
             rentPageSetter(userCheckId,bookCheckedRowList,userflag)
            }
    });
}

/*rentPageSetter fonksiyonu kullanıcı sayfasında kitap listesinde ödünç verilme durumunu belirtmek için kullanılır. */
function rentPageSetter(usercheckid,bookCRowList,userflag){
    var updateList=document.getElementById("rentedtbody");
    for(var i =0;i<bookCRowList.length;i++){
        var checkedrow=bookCRowList[i]
        checkedrow.cells[0].getElementsByTagName("input")[0].checked=false;
        checkedrow.cells[checkedrow.cells.length-1].innerHTML="Alındı";
        var temprow=document.createElement("tr");
        temprow.innerHTML=checkedrow.innerHTML
        temprow.deleteCell(-1);//ödünç durumu
        if(!userflag){
            temprow.deleteCell(-1);// sayfa sayısı
            axios({
                method: "post",
                url:"getuserId",
                data:{userid:usercheckid}
            }).then(answer=>{
                answer=answer.data[0]
                var keys=Object.keys(answer);
                for(var i=0;i<keys.length;i++){
                    var tempcell=temprow.insertCell(i+1);
                    tempcell.innerHTML=answer[keys[i]]
                }
            })
        }
        updateList.append(temprow);
    }
}

/*sendInsertUser fonksiyonu sisteme kullanıcı ekleme işlemi yapılabilmesi içindir.
Sadece admin olan kullanıcı tarafından sisteme kullanıcı eklenebilir. */
function sendInsertUser(form){
    var inputs = form.getElementsByTagName("input");
    axios({
        method:"post",
        url:"InsertUsers",
        data:{userrole:inputs[0].value, username:inputs[1].value, useremail:inputs[2].value, userpassword:inputs[3].value, userphone:inputs[4].value}
    }).then(answer=>{
        if(answer.data == 1) alert("Kullanıcı Ekleme İşlemi Başarılı..");
    });
}

/*userCancelRentBook fonksiyonunda yaptığımız işlem kullanıcı olan kişinin kitap iadesi için yazılmıştır. */
function CancelRentBook(form){
    var checkList = form.getElementsByTagName("input");
    var checkedList = [];
    var selectRow = [];
    for(var temp = 0; temp < checkList.length ; temp++){
        if(checkList[temp].checked){            
            checkedList.push(checkList[temp].id);
            selectRow.push(checkList[temp].parentNode.parentNode.parentNode);
        }
    }
    axios({
        method:"post",
        url:"CancelRentBook",
        data: checkedList
    }).then(answer=>{
        if(answer.data == -1) {
            alert("Kitap İade İşlemi Başarılı..")
            var tbody = selectRow[0].parentNode;
            for( var i=0 ; i<selectRow.length;i++){
                var delIndex = selectRow[i].rowIndex-1;
                tbody.deleteRow(delIndex);
            }
           
            var bookList = document.getElementById("searchAuthor").rows;
            for(var list = 0 ; list < checkedList.length ; list++){
                for(var temp = 0 ; temp < bookList.length ; temp++){
                    var rowID = bookList[temp].cells[0].getElementsByTagName("input")[0].id;
                    var checkrowID = checkedList[list];
                    if(rowID == checkrowID){
                        bookList[temp].cells[bookList[temp].cells.length-1].innerHTML="Alınmamış";
                    }
                }
            }
        }
    });
}

/* rentfiter fonksiyonu kullanıcı tarafından kitap listeleme işleminde checkbox işaretlendiği durumda
    alındı yazısı olan satırları tutması için yazıldı. */
function rentfilter(checkflag){
    var bookrowList=document.getElementById("searchAuthor").rows;
    if(!checkflag){
        for (let index = 0; index < bookrowList.length; index++) {
            const element = bookrowList[index];
            element.setAttribute("style","");
            
        }
    }
    else{
        for (let index = 0; index < bookrowList.length; index++) {
            const element = bookrowList[index];
            var rentcond=element.cells[element.cells.length-1].innerHTML;
            if(rentcond==="Alınmamış")
                element.setAttribute("style","display:None");

        }
    }
}

/*Kitap listeleme sayfasında yazar isimlerine göre sıralama yapmamızı sağlar. */
function listedBook(searchKey,tableid="searchAuthor"){
    var listAuthor = document.getElementById(tableid).rows;
    for(var temp = 0; temp < listAuthor.length ; temp++){
        var tempRow =listAuthor[temp];
        if(searchKey.length > 0 && ! tempRow.cells[2].innerText.toLowerCase().includes(searchKey.toLowerCase())){
            tempRow.setAttribute("style","display: none;")
        }
        else{
            tempRow.setAttribute("style","display: ;")
        }
    }
}

/*Admin sayfasında Kitap güncelleme işlemi yapıyor. */
function sendUpdateRequest(form,rowindex){
    var tempformvalue=[]
    for(var i=0;i<form.cells.length-1;i++){
        if(i==0)        
            tempformvalue.push(form.cells[i].getElementsByTagName("input")[0].id);
        else
            tempformvalue.push(form.cells[i].getElementsByTagName("input")[0].value);
    }
    axios({
        method:"post",
        url:"updateBook",
        data: tempformvalue
    }).then(answer =>{
        if(answer.data == -1){
            alert("Kitap Güncelleme İşlemi Başarılı..");
            inputmemory[rowindex]=tempformvalue.slice(1)
            hideChangeButton(form,rowindex,false);
            updatepagereshaper(tempformvalue);
        }
        else{
            alert("Bu Kitap Ödünç Durumundayken Güncelleme Yapılamaz..");
        }
    })
}
/*Admin tarafında Güncelleme işlemi yaparken buton kontrolü ve satırda bulanan verileri inputmemory değişkenine aktarıyor
aynı zaman da bu değişkenlerin bulunduğu column'ların verilerini set ediyor. */
var inputmemory={};
function hideChangeButton(parentRow,rowindex,flag=true){
    
    for(var i=1;i<parentRow.cells.length-1;i++){
        if(flag){
        if(i==1){//hafıza set
            inputmemory[rowindex]=[]
        }
            var value=parentRow.cells[i].innerText
        
        inputmemory[rowindex].push(value);
        parentRow.cells[i].innerHTML=`<input class="form-control" type="text" value="${value}";">`
        }
        else{
            
            parentRow.cells[i].innerHTML=inputmemory[rowindex][i-1]
        }
    }
    if(flag)
    {
        parentRow.getElementsByTagName("button")[0].setAttribute("style","display:none");
        parentRow.getElementsByTagName("div")[1].style.display=""
    }
    else{
        parentRow.getElementsByTagName("button")[0].style.display=""
        parentRow.getElementsByTagName("div")[1].style.display="None"
        inputmemory[rowindex]=[];
    }
}

/*Admin sayfası için */
function updatepagereshaper(tempRowValue){
    var searchAuthor = document.getElementById("searchAuthor").rows;  
    for(var i=0 ; i< searchAuthor.length ; i++){
       var tempRow = searchAuthor[i];
        var id=tempRow.cells[0].getElementsByTagName("input")[0].id;
        if(id == tempRowValue[0]){
            for(var j=1;j<tempRowValue.length;j++){
                tempRow.cells[j].innerHTML=tempRowValue[j];
            }
            break;                               
        }
    }
}