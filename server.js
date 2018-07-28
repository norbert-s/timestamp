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
app.get("/hello", function (req, res) {
    res.json({greeting: 'hello API'});
})

//------------------------------------------------------------------


let baseOne= app.get('/*', (req, res) =>{
    let plusUrl= '/api/timestamp/',
        path = req.path,
        isCorrectPath = checkCorrPath(path,plusUrl),
        barePath=removeSurp(path,plusUrl);
    ifNotCorrPath(isCorrectPath,barePath,path,plusUrl,res);
    //there are only numbers in the string
    let onlyNum = isNumber(barePath);
    let validDate= ifValidDate(barePath,res);
    //if barePath contains only numbers
    var trimedQueryString = barePath.replace(/%20/g, ' ');
    if(onlyNum){
        let unix = Number(barePath);
        let date = new Date(unix);
        res.json({unix:unix,natural:date});
    }
    if(validDate){
        let unix = Date.parse(trimedQueryString);
        res.json({unix:unix, natural:trimedQueryString});
    }
});
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

let valMinPath =(res,plusUrl)=>{

    res.json({unix:'null',utc:'invalid date'});
}

let ifNotCorrPath=(isCorrectPath,barePath,path,plusUrl,res)=>{
    if(barePath===''){
        let now = new Date();
        res.send(now);
    }
}

var listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});

