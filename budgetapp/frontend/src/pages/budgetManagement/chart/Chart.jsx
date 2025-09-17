import React, { useState } from "react"
import {Chart as ChartJs, 
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js'

import {Line} from 'react-chartjs-2'
import moment from 'moment'

ChartJs.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
)

const Chart = ({ data }) => {
    const { incomes, expenses } = data;

    const dateFormat = (date) =>{
        return moment(date).format('DD/MM/YYYY')
    }

    const chartData = {
        labels: incomes.map((inc) => dateFormat(inc.date)),
        datasets: [
            {
                label: 'Incomes',
                data: incomes.map((income) => income.amount),
                backgroundColor: 'green',
                tension: .2
            },
            {
                label: 'Expenses',
                data: expenses.map((expense) => expense.amount),
                backgroundColor: 'red',
                tension: .2
            }
        ]
    };

    return (
        <div className="ChartStyled" >
            <Line data={chartData} />
        </div>
    );
};


export default Chart