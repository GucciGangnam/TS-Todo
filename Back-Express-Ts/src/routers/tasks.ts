import express from "express";

const tasksRouer = express.Router();

tasksRouer.get("/", ()=> { 
    console.log("getting all tasks")
})

export default tasksRouer;