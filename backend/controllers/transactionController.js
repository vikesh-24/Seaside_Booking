import Transaction from '../models/transaction.js';  


export const createTransaction = async (req, res) => {
    try {
        console.log("Received request body:", req.body);

        const { type, date, details, amount } = req.body;

        if (!type || !date || !details || !amount) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        if (!["Income", "Expense"].includes(type)) {
            return res.status(400).json({ message: "Transaction type must be either 'Income' or 'Expense'" });
        }

        const newTransaction = await Transaction.create({
            type, date, details, amount
        });

        res.status(201).json({ message: "Transaction created successfully", data: newTransaction });
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ message: "Error creating transaction", error: error.message });
    }
};


export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json({ message: "Transactions retrieved successfully", data: transactions });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Error fetching transactions", error: error.message });
    }
};

export const getTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid transaction ID" });
        }

        const transactionData = await Transaction.findById(id);
        if (!transactionData) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ message: "Transaction retrieved successfully", data: transactionData });
    } catch (error) {
        console.error("Error fetching transaction:", error);
        res.status(500).json({ message: "Error fetching transaction", error: error.message });
    }
};


export const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid transaction ID" });
        }

        const updatedTransaction = await Transaction.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ message: "Transaction updated successfully", data: updatedTransaction });
    } catch (error) {
        console.error("Error updating transaction:", error);
        res.status(500).json({ message: "Error updating transaction", error: error.message });
    }
};


export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid transaction ID" });
        }

        const deletedTransaction = await Transaction.findByIdAndDelete(id);
        
        if (!deletedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ message: "Transaction deleted successfully", data: deletedTransaction });
    } catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({ message: "Error deleting transaction", error: error.message });
    }
};
