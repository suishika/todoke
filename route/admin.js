const express=require('express');
const common=require('../libs/common');
const mysql=require('mysql');
var db=mysql.createPool({host: 'localhost',user: 'root',password: '1337', database: 'dojin_circle'});

module.exports=function (){
  var router=express.Router();

  //状态预检验
  router.use((req, res, next)=>{
    if(!req.session['schoolid'] && req.url!='/login'){ //没有登录
      res.redirect('/admin/login');
    }else{
      next();
    }
  });

  //
  router.get('/login', (req, res)=>{
    res.render('admin/login.ejs', {});
  });

  router.post('/login', (req, res)=>{
    var schoolid=req.body.schoolid;
    var password=common.md5(req.body.password+common.MD5_SUFFIX);
    db.query(`SELECT * FROM member_list WHERE schoolid='${schoolid}'`,(err, data)=>{
      if(err){
        console.error(err);
        res.status(500).send('database error').end();
      }else{
        if(data.length==0){
          res.status(400).send('account not exist').end;
        }else{
          if (data[0].password==password){
            //success
            req.session['schoolid']=data[0].ID;
            res.redirect('/admin/');
          }else{
            res.status(404).send('incorrect password').end();
          }
        }
      }
    });
  });

  router.get('/',(req,res)=>{
    res.render('admin/index.ejs',{});
  });

  router.get('/manage',(req,res)=>{
    db.query(`SELECT * FROM member_list`,(err, manage)=>{
      if(err){
        console.error(err);
        res.status(500).send('database error').end();
      }else{
        res.render('admin/manage.ejs',{manage});
      }
    });
  });

  router.post('/manage',(req,res)=>{
    var codename=req.body.codename;
    var schoolid=req.body.schoolid 
    var password=common.md5(req.body.password+common.MD5_SUFFIX);
    var bioname=req.body.bioname;
    var phone=req.body.phone;
    var oicq=req.body.oicq;
    var email=req.body.email;
    var talent=req.body.talent;
    var interest=req.body.interest;
    var wanted=req.body.wanted;
    if (!codename || !schoolid || !password || !bioname || ! phone || !oicq || !email || !wanted){
      res.status(400).send('arg error').end;
    }else{
      db.query(`INSERT INTO member_list(codename,schoolid,password,bioname,phone,oicq,email,talent,interest,wanted) VALUE('${codename}','${schoolid}','${password}','${bioname}','${phone}','${oicq}','${email}','${talent}','${interest}','${wanted}')`,(err,data)=>{
        if(err){
          console.error(err);
          res.status(500).send('database error').end();
        }else{
          res.redirect('/admin/manage');
        }
      })
    }
  });

  return router;
};
