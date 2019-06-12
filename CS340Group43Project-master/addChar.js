module.exports = function(){
    var express = require('express');
    var router = express.Router();

function Dups(req,fname,lname,alias){
    var mysql = req.app.get('mysql');
    var fullname = fname + " " + lname;
    mysql.pool.query("SELECT FName,LName,Alias FROM People WHERE FName=? OR LName=? OR Alias=?",[fname,lname,alias],function(err,rows){
        if (err){
            console.log(err);
            return 404;
        } else if (rows.length===0){
            return 0;
        } else {
            for (var aa=0;aa<rows.length;aa++){
                var rowfullname = rows.FName + " " + rows.LName;
                if (rows.Alias===alias){
                    return 1;
                }
                if (fullname===rowfullname){
                    return 1;
                }
            }
        }
    })
    return 0;
}
function getLocs(req,res){
    var mysql = req.app.get('mysql');
    var context = {};
    mysql.pool.query("SELECT * FROM Locations",function(err,rows){
        if (err){
            console.log(err);
        } else {
            context.locations = rows;
            //console.log(rows[0]);
            res.render('addChar',context);
            }
    });
}
router.get('/',function(req,res){
    getLocs(req,res);
});

router.post('/', function(req, res){
    var dups = Dups(req,req.body.fname,req.body.lname, req.body.alias);
    console.log(req.body.alias);
    console.log(req.body);
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO People (FName, LName, Alias, Race, HomeLocation) VALUES (?,?,?,?,?)";
    if (req.body.fname==="" || req.body.lname==="" || req.body.alias==="" || req.body.race===""){
        alert("Cannot have blank fields");
        res.redirect('/viewChar');
    } else if (dups){
        alert("Cannot have more than one of the same name and/or alias");
        res.redirect('/addChar');
    } else {
    var inserts = [req.body.fname, req.body.lname, req.body.alias, req.body.race, req.body.homeLocation];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            console.log(JSON.stringify(error))
            res.write(JSON.stringify(error));
            res.end();
        } else {
            res.redirect('/viewChar');
        }
    });
    }
});
return router;
}();