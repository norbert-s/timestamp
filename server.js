const express = require('express');
const app = express();
const dateFormat = require('dateformat');
const url = require ('url');
const cors = require('cors');


app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204
app.use(express.static(__dirname + '/public'));
app.get("/", function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});


//------------------------------------------------------------------

let baseOne= app.get('/*', (req, res) =>{
    let plusUrl= '/api/timestamp/';
    let path = req.path;
    let isCorrectPath = checkCorrPath(path,plusUrl);
    let barePath=removeSurp(path,plusUrl);
    let NumLet= onlyLetters(barePath,res);
    //there are only numbers in the string
    if(!isCorrectPath /*&& path.length<15*/){
        valMinPath(res,plusUrl) ;
    }
    if(isCorrectPath && barePath==''){
        let now = new Date();
        let unix = Date.parse(now);
        res.json({unix:unix, natural:now.toUTCString()})
    }


    let onlyNum = isNumber(barePath);

    let validDate= ifValidDate(barePath,res);
    //if barePath contains only numbers
    var trimedQueryString = barePath.replace(/%20/g, ' ');
    if(onlyNum){
        let unix = Number(barePath);
        let date = new Date(unix);
        res.json({unix:unix,natural:date.toUTCString()});
    }
    if(validDate){
        let unix = Date.parse(trimedQueryString);
        res.json({unix:unix, natural:trimedQueryString});
    }
    if(!validDate){
        valMinPath(res);
    }
});

let onlyLetters=(barePath,res)=>{
    let regex = /^[a-zA-Z]+$/g;
    if(regex.test(barePath)){
        valMinPath(res);
    }
}

let valMinPath = function(res){
    res.json({unix:'null',utc:'invalid date'});
}


let ifValidDate=(barePath,res)=>{
    if(Date.parse(barePath)){
        return true;
    }
};

let isNumber=(barePath)=>{
    let regex = /^[0-9]*$/g;
    let isNum= regex.test(barePath);
    return isNum;
}
let removeSurp =(path,plusUrl)=>{
    let newPath=path.slice(plusUrl.length,path.length);
    return newPath;
};

let checkCorrPath=(path,plusUrl)=>{
    let corrPath =false;
    if(path.includes(plusUrl)) corrPath= true;
    return corrPath;
}


var listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});

