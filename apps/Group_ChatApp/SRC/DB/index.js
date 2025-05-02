import mongoose from "mongoose";
import { DB_Folder_Name } from '../constance.js';
import dotenv from 'dotenv';

const ConnectDb = async() => {
    try {

        const connectionInstance = await mongoose.connect(`${process.env.DATABADE_URL}${DB_Folder_Name}`)
		
        console.log(`\n MongoDB connected !! Bd HOST :${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("mongoDB connected error", error);
        process.exit(1)
    }

}

export default ConnectDb;
