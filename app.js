const express=require("express")
const bodyParser=require("body-parser")
const ejs=require("ejs")
let arr=[] //appointment
let name=" "
var options={weekday:"long",year:'numeric',month:'long',day:'numeric'};
var today=new Date().toLocaleDateString("mr-IN",options);
const app=express()
app.set('view engine','ejs')

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

//database connectivity
const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/regDB")
const logger={
    user:String,
    pswd:String
}
const credentials=mongoose.model("regs",logger);

//base route
app.get("/",function(req,res){
    res.render("login",{kindoday:today})
})
app.get("/aps",function(req,res){
    res.render("aps")
})
//succesfull login
app.get("/home",function(req,res){
    res.render("home");
})
app.get("/register",function(req,res){
    res.render("register");
})
app.post("/register",function(req,res){
    let regs=new credentials({
        user:req.body.user_name,
        pswd:req.body.pass
    })
    regs.save()
    console.log(regs)
   res.redirect("/")
})
//handle post rote
app.post("/log",function(req,res){
    credentials.find({},function(err,found){
        let flag=0;
        if(found.length==0){
            console.log("not this")
            res.redirect("/")
        }else{
            console.log(found)
            found.forEach(function(i){
                U=i.user
                P=i.pswd
                if(U==req.body.user_name && P==req.body.pass){
                    console.log("found you")
                    name=req.body.user_name
                    res.redirect("/home")
                    flag=1
                }else{
                    today="invalid credentials";
                }
            })

        }
        if(flag==0){
            res.redirect("/")
        }
    })    
})
app.get("/handle",function (req,res) {
    res.render("handle",{array:arr})
    
})
app.get("/congo",function (req,res) {
    res.render("congo")
    
})
app.get("/medicine",function (req,res) {
    res.render("medicine")
    
})
app.post("/aps",function(req,res){
    let post={
        nam:name,
        symptoms:req.body.txtarea,
        mob:req.body.mob
    }
    arr.push(post)
    console.log(arr)
    res.redirect("/handle")
})
app.listen(3000,function(){
    console.log("server running/started on port 3000")
})
