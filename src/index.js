import dotenv from "dotenv"
import connectDB from "./DB/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './env'
})
//when DB is connected then it must return a promise so we used .then and .catch
connectDB()
    .then(() => {
        //used app.listen for running on the server 
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is Running at Port ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log("MONGO DB connection failed !!! ", err)
    })



//other way to connect with DB
/*
import mongoose from "mongoose";
import { DB_NAME } from "./constants";


import express from "express";
const app = express()

    (async () => {
        try {
            await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
            app.on("Error", (error) => {
                console.log("Error", error)
            })

            app.listen(process.env.PORT, () => {
                console.log(`App is listening on port ${process.env.PORT}`)
            })
        }
        catch (error) {
            console.error("ERROR: ", error)
        }
    })
    */