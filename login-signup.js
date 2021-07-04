require("dotenv").config({path:"/home/amisha/Desktop/PRECTICE/LOGIN-SIGNUP/.env"})
const cookieParser = require("cookie-parser");
const express = require("express");
const jwt = require("jsonwebtoken");
const myconnection = require("./connect_mysql");
const auth=require("./auth")
const app = express();
app.use(express.json());
app.use(cookieParser())


app.get("/user",(req,res)=>{
    try{
        cookie_tokon=req.headers.authorization
        user_tokon=cookie_tokon.slice(14,193);
        const verify = jwt.verify(user_tokon,"myjwt",(err)=>{
            if (!err){
                user_detail={
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password
                }
                res.send(user_detail)
            }
        });
    }
    catch{
        res.status(401).send("you need to signup")
    }
    
})

app.post("/api/signup", (req, res) => {
    //creating a object
    try {
        const object = {
            Name: req.body.name,
            Email_Id: req.body.email,
            Password: req.body.password
        }
        const Name = object.Name;
        const email = object.Email_Id;
        const password = object.Password;
        
        //Insert the data in Database
        var sql = "INSERT INTO data (Name,EmailId,Password) VALUES ?";
        var values = [[Name, email, password]];
        myconnection.query(sql, [values], (err, result) => {
            if (err) throw err;
            res.send("you have signup successfully");
        });

    }
    catch (error) {
        res.status(400).send(`invalid signup ${error}`);
    }

})
app.post("/api/login", (req, res) => {
    //creating a object
    try {
        const object = {
            Name: req.body.name,
            Password: req.body.password,
            email:req.body.email
        }
        const name = object.Name;
        const password = object.Password;
        const Email_Id=object.email

        //select the data from database
        var sql = `select * from data where password= '${password}' and name= '${name}'`;
        myconnection.query(sql, (err, result) => {
            if (err) throw err;
            if (result != 0) {
                res.send(`${name} succsessfully login`);
            }
            else {
                res.send(`Opps you are unable to login `);
            }
        });

        //craete a token from jwt
        const createTokon = (Email_Id) => {
            const tokon = jwt.sign({email_id: Email_Id,  data_time: Math.floor(Date.now()/1000)-30 }, process.env.SECRET_KEY);
            return (tokon);
        }
        const created_tokon = createTokon(Email_Id);

        res.cookie('jwt', created_tokon, { httpOnly: true, secure: true, maxAge: 3600000 });


    }
    catch (error) {
        res.status(400).send(`invalid signup ${error}`);
    }

})


app.listen(3000, (err) => {
    if (err) {
        console.log(err)
    }
    console.log("listning");
})



