const express=require('express');
const expressStatic=require('express-static');
const mysql=require('mysql');
const bodyParser=require('body-parser');
const multer=require('multer');
const multerObj=multer({dest:`./static/upload`});
const cookieParser=require('cookie-parser');
const cookieSession=require('cookie-session');
const expressRoute=require('express-route');
const consolidate=require('consolidate');

var server=express();
server.listen(8080);


//获取请求数据
server.use(bodyParser.urlencoded())
server.use(multerObj.any());


//cookie、session
server.use(cookieParser());
(function () {
    var keys=[];
    for (var i=0;i<100000;i++){
        keys[i]='a_'+Math.random();
    }
    server.use(cookieSession({
        name: 'sess_id',
        keys: keys,
        maxAge: 20*60*1000  //20min
    }));
})();

//模板
server.engine('html', consolidate.ejs);
server.set('views','template');
server.set('view engine','html');

//路由
server.use('/', require('./route/www.js')());
server.use('/admin/', require('./route/admin.js')());

//default:static
//server.use(static('./static'))




