const express=require("express")
const bodyParser = require("body-parser")
const mongoose =require("mongoose")
const app=express()
const routes=require("./Routes/Route.js")
const cors=require("cors")
const { json } = require("body-parser")
require('dotenv').config()



const PORT=8000

app.use(cors())
app.use(bodyParser.json({limit: '50mb',extended:true}))
app.use(bodyParser.urlencoded({limit: '50mb',extended:true}))


mongoose.set('strictQuery',true);

 const mongoDB=process.env.MONGO_URL
 mongoose.connect(mongoDB, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));


app.use("/", routes)

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });



app.listen(PORT,()=>{
    console.log(`app running on port no ${PORT}`)
})