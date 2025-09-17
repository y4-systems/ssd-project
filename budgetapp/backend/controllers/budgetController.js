import Budget from "../models/BudgetModel.js";

export const createBudget = async(req, res) => {
    try {

        const budgetData = new Budget(req.body);

        if(!budgetData){
            return res.status(404).json({msg: "Budget Data Not Found"});
        }

        const savedDatga = await budgetData.save();
        res.status(200).json({savedDatga, msg: "Budget Created Successfully"});

    } catch (error) {
        res.status(500).json({error: error});
    }
}

export const getAllBudgets = async(req, res) => {
    try {

        const budgetData = await Budget.find();
        if(!budgetData) {
            return res.status(400).json({msg: "Budget Data Not Found"});
        }
        res.status(200).json(budgetData);

    } catch (error) {
        res.status(500).json({error: error});
    }
}

export const getOneBudget = async(req, res) => {
    try {

        const id = req.params.id;
        const budgetExist = await Budget.findById(id);
        if(!budgetExist) {
            return res.status(400).json({msg: "Budget Not Found"});
        }
        res.status(200).json(budgetExist);
        
    } catch (error) {
        res.status(500).json({error: error});
    }
}

export const updateBudget = async(req, res) => {
    try {

        const id = req.params.id;
        const budgetExist = await Budget.findById(id);
        if(!budgetExist) {
            return res.status(400).json({msg: "Budget Not Found"});
        }

        const updatedData = await Budget.findByIdAndUpdate(id, req.body, {new:true});
        res.status(200).json({msg: "Budget Updated Successfully"});

        
    } catch (error) {
        res.status(500).json({error: error});
    }
}


export const deleteBudget = async(req, res) => {
    try {

        const id = req.params.id;
        const budgetExist = await Budget.findById(id);
        if(!budgetExist) {
            return res.status(404).json({msg: "Budget Not Exist"});
        }
        await Budget.findByIdAndDelete(id);
        res.status(200).json({msg: "Budget Deleted Successfully"});
        
    } catch (error) {
        res.status(500).json({error: error});
    }
}