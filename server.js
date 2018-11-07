const express=require('express');
const expressStatic=require('express-static');

var server=express();
server.listen(8080);


//none-database demo
var users={
    'rika': '12345',
    'akane': '54321'
}

//api

server.get('/login',function(req,res){
    var usr=req.query['usr'];
    var pwd=req.query['pwd'];
    if(users[usr]==null || users[usr]!=pwd){
        res.send({ok: false,msg: "用户名或密码错误"});
    }else{
        res.send({ok: true,msg: "登录成功"});
    }
});

server.use(expressStatic('./www'));

