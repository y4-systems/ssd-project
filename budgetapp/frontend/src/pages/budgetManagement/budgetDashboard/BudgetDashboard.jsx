import React, { useEffect, useState } from 'react';
import './budgetdashboard.css';
import History from '../history/History';
import Chart from '../chart/Chart';
import axios from 'axios';

const BudgetDashboard = () => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ incomes: [], expenses: [] });

    const totalIncome = () => {
        return incomes.reduce((acc, income) => acc + income.amount, 0);
    };
    
    const totalExpenses = () => {
        return expenses.reduce((acc, expense) => acc + expense.amount, 0);
    };
    
    const totalBalance = () => {
        return totalIncome() - totalExpenses();
    };

    const getIncomes = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/getIncomes");
            setIncomes(response.data);
        } catch (error) {
            console.error("Error fetching incomes:", error);
        }
    };

    const getExpenses = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/getExpenses");
            setExpenses(response.data);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [incomesResponse, expensesResponse] = await Promise.all([
                    axios.get("http://localhost:8000/api/getIncomes"),
                    axios.get("http://localhost:8000/api/getExpenses")
                ]);
                setIncomes(incomesResponse.data);
                setExpenses(expensesResponse.data);
                setData({ incomes: incomesResponse.data, expenses: expensesResponse.data });
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false); 
            }
        };
    
        fetchData();
    }, []);

    return (
        <div className='DashboardStyled'>
            <div className='innerLayout'>
                <h1>All Transactions</h1>
                <div className="stats-con">
                    <div className="chart-con">
                    {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <Chart data={data} />
                        )}
                        <div className="amount-con">
                            <div className="income">
                                <h3>Total Income</h3>
                                <p>LKR {totalIncome()}</p>
                            </div>
                            <div className="expense">
                                <h3>Total Expense</h3>
                                <p>LKR {totalExpenses()}</p>
                            </div>
                            <div className="balance">
                                <h2>Total Balance</h2>
                                <p>LKR {totalBalance()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="history-con">
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <History incomes={data.incomes} expenses={data.expenses} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BudgetDashboard;
