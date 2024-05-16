import dotenv from "dotenv"
import connect from "./db/index.js";
import app from "./app.js";

dotenv.config({
    path:"./env"
})
connect()
.then(()=>{
    app.listen(process.env.PORT || 3000 ,()=>{
      console.log(`server is running ${process.env.PORT}`)
    })
  })
  .catch((err)=>{
    console.log("mogngo connection eroor",err)
  })