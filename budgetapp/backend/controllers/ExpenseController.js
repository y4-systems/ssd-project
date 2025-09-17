import Expense from "../models/ExpenseModel.js";

export const addExpense = async (req, res) => {
    const { title, amount, type, date, category, description } = req.body;

    const expense = new Expense({
        title,
        amount,
        type,
        date,
        category,
        description
    });

    try {
        // Validation
        if (!title || !amount || !date || !category || !description) {
            return res.status(400).json({ msg: "Please fill in all fields" });
        }
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ msg: "Amount must be a positive number" });
        }

        await expense.save();
        res.status(200).json({ msg: "Expense added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

    console.log(expense);
}

export const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find().select("title type category amount date").sort({ createdAt: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteExpense = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedExpense = await Expense.findByIdAndDelete(id);
        if (!deletedExpense) {
            return res.status(404).json({ msg: "Expense not found" });
        }
        res.status(200).json({ msg: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
