
const express = require('express')
const app = express()
const bp = require("body-parser");
const http = require('http').createServer(app)
require("./src/db/conn.js");
const Register = require("./src/model/Schema");
const path = require("path")
const PORT = process.env.PORT || 1000


app.use(bp.urlencoded({extended:false}));
app.use(bp.json())

http.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`)
})


// render the static file
app.use(express.static(__dirname + '/public'))  // Express. js is a routing and Middleware framework for handling the different routing of the webpage and it works between the request and response cycle
const view_path =path.join(__dirname,"./views")
app.set("view engine", "hbs")
app.set("views",view_path)


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/navbar.html')
})
app.get('/sign_up', (req, res) => {
    res.sendFile(__dirname + '/sign.html')
})

app.post('/sign_up', async(req, res) => {
    try{
        if(req.body.password === req.body.confirmpassword){
            const addingData = await Register({
               firstname: req.body.fname,
               lastname: req.body.Lname,
                email:req.body.email,
                password:req.body.password,
                confirmpassword:req.body.confirmpassword
            })
            addingData.save();
        
            res.status(200).sendFile(__dirname+"/navbar.html");
        }
        else{
            res.status(400).send("Password does not match");
        }
    }catch(e){
        res.status(400).send(e);
    }
})
app.get('/log_in', (req, res) => {
    res.sendFile(__dirname + '/login.html')
})
app.post('/log_in', async(req, res) => {
    try{
        data = await Register.find({"email":req.body.email});
        if(req.body.email === data[0].email && req.body.password === data[0].password) {
            res.render("index",{
                username: data[0].firstname,
            })
            // Succesfully login
        }
        else{
            res.status(400).send("Login failed ...fill the correct email or password or if you have not signed up yet then first you have to sign up" );
        }
     
    }catch(error){
        res.status(400).send(error);
    }

    
})

//log out section
app.use("/log_out",(req,res)=>{
    res.status(200).sendFile(__dirname+"/navbar.html");
})

// Socket 
const io = require('socket.io')(http)
var users = {};
io.on('connection', (socket) => {
    console.log('Connected...')
    socket.on("new-user",()=>{
        users[socket.id] = data[0].firstname
        socket.broadcast.emit("user",users[socket.id])
    })
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })

    socket.on('disconnect', ()=>{
        // if someone leaves the chat , let other user know.
           socket.broadcast.emit('leave',users[socket.id] );
           delete users[socket.id];
       });

})