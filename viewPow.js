module.exports = function(){
    var express = require('express');
    var router = express.Router();
function getPows(req,res){
    var mysql = req.app.get('mysql');
    var context = {};
    mysql.pool.query("SELECT * FROM Powers",function(err,rows){
        if (err){
            console.log(err);
        } else {
            context.power = rows;
            context.jsscripts = ["deleteChar.js"];
            res.render('viewPow',context);
            }
    });
};

function getPowsForUpdate(res,mysql,context,id,complete){
    var sql = "SELECT Powers.ID AS ID, Name, Category FROM Powers WHERE Powers.ID = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function (err, results) {
        if (err) {
            console.log("error= ");
            console.log(err);
        } else {
            context.powers = results[0];
            complete();
            }
        });
};

function getPowsForChar(res,mysql,context,id,complete){
    var sql = "SELECT FName, LName, Alias, pepID, powID, Name FROM Powers INNER JOIN People_Power ON Powers.ID=powID INNER JOIN People ON pepID=People.ID WHERE Powers.ID=?";
    var inserts = [id];
    mysql.pool.query(sql,inserts,function(err,rows){
        if (err){
            console.log(err);
        } else {
            if (rows.length>0){
                console.log(rows);
                context.Name = rows[0].Name;
                context.data = rows;
            } else {
                mysql.pool.query('SELECT Name FROM Powers WHERE ID=?',[id],function(err1,rows1){
                    console.log(rows1);
                    //context.Name= rows1[0].Name;
                })
            }
            context.powID = id;
            complete();
        }
    })
}

function getCharsNotInPow(res,mysql,context,id,complete){
    var sql = "SELECT  Alias, pepID, powID, ID FROM People LEFT JOIN People_Power ON People.ID=pepID";
    mysql.pool.query(sql,function(err,rows){
        if (err){
            console.log(err);
        } else {
            var spliceArr = [];
            var charArr = [];
            for (var aa=0;aa<rows.length;aa++){
                if (rows[aa].powID==id){
                    spliceArr.push(rows[aa].Alias);
                }
            }
            for (var bb=0;bb<rows.length;bb++){
                if (spliceArr.indexOf(rows[bb].Alias)===-1){
                    charArr.push(rows[bb]);
                }
            }
            context.people = charArr;
            complete();
        }
    })
}

router.get('/',function(req,res){
    getPows(req,res)
});
router.post('/', function(req, res){
    if (req.body.Name===""){
        alert("Name cannot be blank.");
        res.redirect('/addPow');
    }
    console.log(req.body.Name);
    console.log(req.body);
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO Powers (Name, Category) VALUES (?,?)";
    var inserts = [req.body.Name, req.body.Category];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            console.log(JSON.stringify(error))
            res.write(JSON.stringify(error));
            res.end();
        } else {
            res.redirect('/viewPow');
        }
    });
});

router.post('/Char/',function(req,res){
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO People_Power (pepID, powID) VALUES (?,?)";
    var inserts = [req.body.Alias, req.body.powid];
    console.log("Inserting into People_Power: " + req.body.Alias + " " + req.body.powid);
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            console.log(JSON.stringify(error));
            res.write(JSON.stringify(error));
            res.end();
        } else {
            res.redirect('/viewPow');
        }
    });
})

router.get('/:id', function (req, res) {
    callbackCount = 0;
    var context = {};
    context.jsscripts = ["updateChar.js"];
    var mysql = req.app.get('mysql');
    getPowsForUpdate(res, mysql, context, req.params.id, complete);
    function complete() {
        callbackCount++;
        if (callbackCount >= 1) {
            res.render('updatePow', context);
        }
    }
});

router.get('/Char/:id',function(req,res){
    callbackCount = 0;
    var context = {};
    context.jsscripts = ["deleteChar.js"];
    var mysql = req.app.get('mysql');
    getPowsForChar(res, mysql, context, req.params.id, complete);
    getCharsNotInPow(res, mysql, context, req.params.id, complete);
    function complete() {
        callbackCount++;
        if (callbackCount >= 2) {
            res.render('viewPowChar', context);
        }
    }
})


router.put('/:id', function (req, res) {
    var mysql = req.app.get('mysql');
    console.log(req.body);
    console.log(req.params.id);
    var sql = "UPDATE Powers SET Name=?, Category=? WHERE ID=?";
    var inserts = [req.body.Name, req.body.Category];
    sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.write(JSON.stringify(error));
            res.end();
        } else {
            res.status(200);
            res.end();
        }
    });
});

router.delete('/:id', function(req, res){
    var mysql = req.app.get('mysql');
    var sql = "DELETE FROM Powers WHERE ID = ?";
    var inserts = [req.params.id];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
            console.log(error)
            res.write(JSON.stringify(error));
            res.status(400);
            res.end();
        }else{
            res.status(202).end();
        }
    })
})

router.delete('/Char/:pepid/:powid',function (req,res){
    var mysql = req.app.get('mysql');
    var sql = "DELETE FROM People_Power WHERE pepID=? AND powID =?";
    var inserts = [req.params.pepid,req.params.powid];
    mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
            console.log(error)
            res.write(JSON.stringify(error));
            res.status(400);
            res.end();
        }else{
            res.status(202).end();
        }
    })
})
return router;
}();