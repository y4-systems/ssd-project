import Income from "../models/IncomeModel.js";

export const addIncome = async (req, res) => {
    const { title, amount, type, date, category, description } = req.body;

    const income = new Income({
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
            return res.status(400).json({ msg: "Please Fill in All Fields" });
        }
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ msg: "Amount must be a Positive Number" });
        }

        await income.save();
        res.status(200).json({ msg: "Income Added Successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

    console.log(income);
}

export const getIncomes = async (req, res) => {
    try {
        const incomes = await Income.find().select("title type category amount date").sort({ createdAt: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteIncome = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedIncome = await Income.findByIdAndDelete(id);
        if (!deletedIncome) {
            return res.status(404).json({ msg: "Income not found" });
        }
        res.status(200).json({ msg: "Income deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
