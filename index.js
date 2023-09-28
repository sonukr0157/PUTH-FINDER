const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
app.set('view engine', 'ejs');
const request = require('request');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
var busnum="";
var busroute="";
mongoose.connect("mongodb://127.0.0.1:27017/busdata", { useNewUrlParser: true });
const bus = new mongoose.Schema({
    name:{type:String,index:true},
    busnumber:String,
    contact:[]
});
const Bus = mongoose.model("Bus",bus);
Bus.ensureIndexes(function(err) {
    if (err)
        console.log(err);
    else
        console.log('create name index successfully');
});
app.get("/",function(req,res){
    res.render("index",{busnumber:busnum,route:busroute});
})
app.get("/busnumber",function(req,res){

    res.render("busnumber");
});
app.post("/",function(req,res){
    console.log("in post");
    Bus.findOne({name:req.body.place},function(err,bus){
        console.log(bus.name);
      busnum=bus.busnumber;
      busroute=bus.name;
        res.redirect("/");
    })
})
 
app.get('/autocomplete', async (req, res, next) => {
    const s = req.query.s.trim();
    const results = [];

    try {
        const products = await Bus.find({ name: { $regex: s, $options: 'i' } } ).limit(10);
        
        products.forEach(product => {
            let { id, name } = product;
            results.push({ value: name, label: name });
        });
        
    } catch(err) {
        console.log(err);
    }
    res.json(results);
});

app.post("/subscribe",function(req,res){
    console.log(req.body);
   Bus.findOneAndUpdate(
    {name:req.body.route},{$push:{contact:req.body.cont}},function(err,success){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/");
        }
    }
   ) 
})
app.get("/admin",function(req,res){
    res.render("admin");
})

app.post("/update",function(req,res){
    var p=req.body;
    console.log(p);
    const new1 = new Bus({
        name: req.body.place,
        busnumber: req.body.newnumber
      });


      
   //working
    //   const options = {
    //     method: 'POST',
    //     url: 'https://sms77io.p.rapidapi.com/sms',
    //     headers: {
    //       'content-type': 'application/x-www-form-urlencoded',
    //       'X-RapidAPI-Key': '2d94067713msh0a3d1d055212009p1b1aa0jsn41e0164dffc0',
    //       'X-RapidAPI-Host': 'sms77io.p.rapidapi.com',
    //       useQueryString: true
    //     },
    //     form: {
    //       to: '+917209289203',
    //       p: 'AV2euEJbG7BGAltH2AykMV1iWPMfxnHq5Y3UlrvCkY6hcYk7NdFcX8vojGaZ0zLs',
    //       text: 'Dear customer. We want to say thanks for your trust. Use code MINUS10 for 10 % discount on your next order!'
    //     }
    //   };
      
    //   request(options, function (error, response, body) {
    //       if (error) throw new Error(error);
      
    //       console.log(body);
    //   });     





// const options = {
//   method: 'POST',
//   url: 'https://d7sms.p.rapidapi.com/messages/v1/send',
//   headers: {
//     'content-type': 'application/json',
//     Token: 'undefined',
//     'X-RapidAPI-Key': '2d94067713msh0a3d1d055212009p1b1aa0jsn41e0164dffc0',
//     'X-RapidAPI-Host': 'd7sms.p.rapidapi.com',
//     useQueryString: true
//   },
//   body: {
//     messages: [
//       {
//         channel: 'sms',
//         originator: 'SMS',
//         recipients: ['+917209289203'],
//         content: 'Greetings from D7 API ',
//         msg_type: 'text'
//       }
//     ]
//   },
//   json: true
// };

// request(options, function (error, response, body) {
// 	if (error) throw new Error(error);

// 	console.log(body);
// });
      new1.save(function(err){
        if (!err){
            res.redirect("/");
        }
      });
    
})


app.listen(process.env.PORT||3000, function () {
    console.log("Server is running on port 3000")
})