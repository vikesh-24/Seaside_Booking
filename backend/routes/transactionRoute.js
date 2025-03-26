import express from "express";
import {
    createTransaction,
    getAllTransactions,
    getTransaction,
    updateTransaction,
    deleteTransaction
} from "../controllers/transactionController.js"; 

const transactionRouter = express.Router();


transactionRouter.get("/all", getAllTransactions); 
transactionRouter.post("/add", createTransaction); 
transactionRouter.get("/:id", getTransaction); 
transactionRouter.put("/edit/:id", updateTransaction); 
transactionRouter.delete("/delete/:id", deleteTransaction); 

export default transactionRouter;
