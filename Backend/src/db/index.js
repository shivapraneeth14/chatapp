import mongoose from "mongoose";
import { DB_NAME } from "../../constant.js";


const connect= async ()=>{
   try {
      const connection = await mongoose.connect(process.env.MONGO_URI, {
         dbName: DB_NAME  
      }); console.log("host",connection.connection.host)
   } catch (error) {
    console.log("cannot connect",error)
   }
}

export default connect;