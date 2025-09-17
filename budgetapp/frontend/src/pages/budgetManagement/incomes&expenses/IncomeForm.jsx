import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../../../components/Button/Button";
import axios from "axios";
import toast from "react-hot-toast";
import "./incomeform.css";
import TextField from "@mui/material/TextField";
import { plus } from "../../../assets/budgetImages/budgetIcons";

const IncomeForm = () => {
  const today = new Date(); // Get today's date
  const [inputState, setInputState] = useState({
    title: "",
    amount: "",
    date: today, // Set default date to today's date
    category: "",
    description: "",
  });

  const [error, setError] = useState(null);

  const handleInput = (name) => (e) => {
    setInputState({ ...inputState, [name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputState.title.trim()) {
      setError("Please Enter a Title for the Income.");
      return;
    }
    if (isNaN(inputState.amount) || inputState.amount <= 0) {
      setError("Please enter a Valid Amount.");
      return;
    }
    if (!inputState.date) {
      setError("Please select a Date.");
      return;
    }
    if (!inputState.category) {
      setError("Please select a Category.");
      return;
    }
    try {
      await axios.post("http://localhost:8000/api/addIncome", inputState);
      setInputState({
        title: "",
        amount: "",
        date: today, // Reset date to today's date after submission
        category: "",
        description: "",
      });
      toast.success("Income Added Successfully!");
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}

      <div className="input-control">
        <TextField
          type="text"
          value={inputState.title}
          name="title"
          id="title"
          label="Income Title"
          onChange={handleInput("title")}
        />
      </div>

      <div className="input-control">
        <TextField
          value={inputState.amount}
          type="text"
          name="amount"
          id="amount"
          label="Income Amount"
          onChange={handleInput("amount")}
        />
      </div>

      <div className="input-control">
        <DatePicker
          id="date"
          placeholderText="Enter A Date"
          selected={inputState.date}
          dateFormat="dd/MM/yyyy"
          onChange={(date) => setInputState({ ...inputState, date })}
          minDate={new Date("1900-01-01")} // Set minDate to an earliest allowed date
          maxDate={today} // Set maxDate to today's date
        />
      </div>

      <div className="selects input-control">
        <select
          required
          value={inputState.category}
          name="category"
          id="category"
          onChange={handleInput("category")}
        >
          <option value="" disabled>
            Select Income Category
          </option>
          <option value="Vendors Commission">Vendors Commission</option>
          <option value="Clients Fees">Clients Fees</option>
          <option value="Consultation Fees">Consultation Fees</option>
          <option value="Advertising Revenue">Advertising Revenue</option>
          <option value="Affiliate Marketing">Affiliate Marketing</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="input-control">
        <TextField
          name="description"
          value={inputState.description}
          label="Add A Reference"
          id="description"
          multiline
          rows={4}
          fullWidth
          onChange={handleInput("description")}
        />
      </div>

      <div className="income-submit-btn">
        <Button
          name="Add Income"
          icon={plus}
          bPad=".8rem 1.6rem"
          bRad="30px"
          bg="#4d1c9c"
          color="#fff"
          onClick={handleSubmit}
        />
      </div>
    </form>
  );
};

export default IncomeForm;
