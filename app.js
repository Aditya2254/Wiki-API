const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const config = require("./config.js");
const ejs = require("ejs");

const app = express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.route("/articles")

    .post(function(req,res) {
        let title =  req.body.title;
        let content = req.body.content;
        let sql = `insert into articles values(default,?,?)`;
        let data = [title,content];
        let connection = mysql.createConnection(config);
        connection.query(sql,data,function(err,results,fields){
            if(err){
                res.send(err);
            }
            res.send("Success! "+results.affectedRows +" row(s) affected.");
        }); 
        connection.end();
    })

    .delete(function(req,res) {
        let connection = mysql.createConnection(config);
        let sql = `delete from articles`;
        connection.query(sql,function(err,results,fields){
            if(err){
                res.send(err);
            }
            res.send("Success! "+results.affectedRows+" row(s) affected.");
        });
        connection.end();
    })

    .get(function(req,res) {
        let connection = mysql.createConnection(config);
        let sql = `SELECT * FROM articles`;
        connection.query(sql,function(err,results,fields) {
            if(err){
                res.send(err);
            }
            res.send(results);
        });
        connection.end();
    })
;

app.route("/articles/:articleTitle")

    .get(function(req,res) {
        let title = req.params.articleTitle;
        let connection = mysql.createConnection(config);
        let sql = `select * from articles where title=?`;
        let data = [title];
        connection.query(sql,data,function(err,results,fields) {
            if(err){
                res.send(err);
            }
            res.send(results);
        });
        connection.end();
    })
    .put(function(req,res) {
        let oldTitle = req.params.articleTitle;
        let title = req.body.title;
        let content = req.body.content;
        let connection = mysql.createConnection(config);
        let sql = `update articles set title=?,content=? where title=?`;
        let data = [title,content,oldTitle];
        connection.query(sql,data,function(err,results,fields) {
            if(err){
                res.send(err);
            }
            res.send(results.changedRows+" rows affected.");
        });
        connection.end();
    })
    .patch(function(req,res) {
        let oldTitle = req.params.articleTitle;
        let connection = mysql.createConnection(config);
        let sql = `update articles set ? where title=?`;
        let data = [req.body,oldTitle];
        connection.query(sql,data,function(err,results,fields) {
            if(err){
                res.send(err);
            }
            res.send(results.affectedRows+" rows affected.");
        });
        connection.end();
    })
    .delete(function(req,res) {
        let title = req.params.articleTitle;
        let connection = mysql.createConnection(config);
        let sql = `delete from articles where title=?`;
        let data = [title];
        connection.query(sql,data,function(err,results,fields) {
            if(err){
                res.send(err);
            }
            res.send(results.affectedRows+" rows deleted");
        });
        connection.end();
    })
;

app.listen(3000,function() {
    console.log("Server is running on port 3000");
})