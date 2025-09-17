import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import "./getbudget.css"
import { Link } from 'react-router-dom'

export const GetBudget = () => {

    const [budget, setBudget] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            const response = await axios.get("http://localhost:8000/api/getAllBudgets");
            setBudget(response.data);
        }

        fetchData();
    },[])

    const deleteBudget = async (budgetId) => {
        await axios.delete(`http://localhost:8000/api/deleteBudget/${budgetId}`)
        .then((response) => {
            setBudget((prevBudget) => prevBudget.filter((budget) => budget._id !== budgetId));
            toast.success(response.data.msg, {
                position: "top-right",
                // duration: 4000,
                // icon: "👏",
            });
        })
        .catch((error) => {
            console.log(error);
        })
    }

  return (
    <div className='budgetTable'>
        <Link to={"/addBudget"} className='addButton'>Add Budget</Link>
        <table border={1} cellPadding={10} cellSpacing={0}>
            <thead>
                <tr>
                    <th>Number</th>
                    <th>Event ID</th>
                    <th>Package ID</th>
                    <th>Estimated Amount</th>
                    <th>Total Amount</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    budget.map((budget, index) => {
                        return(
                            <tr key={budget._id}>
                                <td>{index + 1}</td>
                                <td>{budget.eventID}</td>
                                <td>{budget.packageID}</td>
                                <td>{budget.estimatedAmount}</td>
                                <td>{budget.totalAmount}</td>
                                <td className='actionButton'>
                                    <button onClick={() => deleteBudget(budget._id)}><i className="fa-solid fa-trash"></i></button>
                                    <Link to={`/updateBudget/` + budget._id}><i className="fa-solid fa-pen-to-square"></i></Link>
                                </td>
                            </tr>

                        )
                    })
                }
                
            </tbody>
        </table>
    </div>
  )
}
