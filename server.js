require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const bp = require("body-parser");
const bcrypt = require("bcryptjs");
const cookieparser = require("cookie-parser");
const http = require("http").createServer(app);
require("./src/db/conn.js");
const Register = require("./src/model/Schema");
const path = require("path");
const cookieParser = require("cookie-parser");
const auth = require("./src/middleware/auth");
const { flags } = require("socket.io/lib/namespace.js");
const PORT = process.env.PORT || 1000;
// require("./sign.js")
let flag;
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.use(cookieParser());

http.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
});

// render the static file
app.use(express.static(__dirname + "/public")); // Express. js is a routing and Middleware framework for handling the different routing of the webpage and it works between the request and response cycle
const view_path = path.join(__dirname, "./views");
app.set("view engine", "hbs");
app.set("views", view_path);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/navbar.html");
});
app.get("/chat",auth, async(req,res)=>{
        userData = req.user;
        flag=true;
     res.status(201).render("index", {
     username: userData.firstname,
  });
})
app.get("/sign_up", (req, res) => {
  res.sendFile(__dirname + "/sign.html");
});

app.post("/sign_up", async (req, res) => {
  try {
    //      const email = req.body.email;
    //      const useremail = await Register.findOne({email:email});
    //      if(useremail.email === email){
    //        res.status(400).send("This email id already exist. Means you do not have to need sign up from this email id. It has been already signed up from this email id.");
    //  }
    if (req.body.password === req.body.confirmpassword) {
      const addingData = await Register({
        firstname: req.body.fname,
        lastname: req.body.Lname,
        email: req.body.email,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
      });
 
      const token = await addingData.generateAuthToken();
      // console.log(token);
      // Use middleware here which writeen in the file Schema.js file


      // the res.cookie() function is used to set the cookie name to value.
      // the value parameter may be a string or objects converted to json.
// example:  res.cookie("cookie_name", value, [options])
  // storing the cookie(token) at the browser storage
      res.cookie("jwt_token", token, {
        expires:new Date(Date.now() + 43200000),   // 43200000 miliseconds is equal to 12 hour means your cookie is automatically deleted from your browser storage after 12 hour
        httpOnly:true   // it means before 12 hour you cookie not deleted unless you delete him manually( means just by going in setting and cutomally delted).
      });
      const registered = await addingData.save();

      res.status(200).sendFile(__dirname + "/navbar.html");
    } else {
      res.status(400).send("Password does not match. Try again...");
    }
  } catch (e) {
    res.status(400).send("Something went wrong.");
  }
});
app.get("/log_in", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});
app.post("/log_in", async (req, res) => {
  try {
    const password = req.body.password;
    const email = req.body.email;
    data = await Register.findOne({ email: email });
    const isMatch = await bcrypt.compare(password, data.password);
    //middleware for generating the token  which is generate in the Shcema.js file
    const token =await data.generateAuthToken();
    // console.log(token);
    // example how to store the cookie on the browser storage:  res.cookie("cookie_name", value, [options])
    // storing the cookie(token) at the browser storage
    res.cookie("jwt_token", token, {
      expires:new Date(Date.now() + 43200000),   // 43200000 miliseconds is equal to 12 hour means your cookie is automatically deleted from your browser storage after 12 hour
      httpOnly:true   // it means before 12 hour you cookie not deleted unless you delete him manually( means just by going in setting and cutomally delted).
    });


    if (email === data.email) {
      if (isMatch) {
        res.status(201).render("index", {
          username: data.firstname,
        });
        // Succesfully login
      } else {
        res.status(400).send("Invalid Password.");
      }
    } else {
      res
        .status(400)
        .send(
          "Login failed ...fill the correct email or password or if you have not signed up yet then first you have to sign up."
        );
    }
  } catch (error) {
    res
      .status(400)
      .send(
        "This email id does not exist. Please Sign up first then do log in."
      );
  }
});

//log out section
app.get("/log_out",auth,async (req, res) => {

    req.user.tokens = req.user.tokens.filter((currentElement)=>{
      return currentElement.token !== req.token
     })
    // req.user.tokens = [];   IMPORTANT If you want to log out from all devices where you logged in then just empty the all tokens and save .
  res.clearCookie("jwt_token");
  await req.user.save();
  res.status(200).sendFile(__dirname + "/navbar.html");
});

// Socket
const io = require("socket.io")(http);
var users = {};
io.on("connection", (socket) => {
 // console.log("Connected...");
  socket.on("new-user", () => {
    if(flag == true){
      users[socket.id] = userData.firstname;
    }
    else{
      users[socket.id] = data.firstname;
      socket.broadcast.emit("user", users[socket.id]);
    }
    
  });
  socket.on("message", (msg) => {
    socket.broadcast.emit("message", msg);
  });

  socket.on("disconnect", () => {
    // if someone leaves the chat , let other user know.
    socket.broadcast.emit("leave", users[socket.id]);
    delete users[socket.id];
  });
});
