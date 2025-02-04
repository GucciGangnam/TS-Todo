import express from "express";

const listsRouter = express.Router();

listsRouter.get("/", ()=> { 
    console.log("getting all lists")
})


export default listsRouter;