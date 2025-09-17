import React, { useState } from "react";
import "./addbudget.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";

const AddBudget = () => {
  const budgets = {
    eventID: "",
    groomName: "Customized",
    brideName: "",
    packages: "",
    estimatedBudget: "",
    additionalNotes: "",
  };

  const [budget, setBudget] = useState(budgets);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setBudget({ ...budget, [name]: value });
  };

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.checked,
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const vendorServices = Object.keys(state).filter((service) => state[service]);
    const budgetToSend = {
      ...budget,
      vendorServices: vendorServices,
    };
    await axios
        .post("http://localhost:8000/api/createBudget", budgetToSend)
        .then((response) => {
          toast.success(response.data.msg, { position: "top-center" });
          navigate("/displayBudgets");
        })
        .catch((error) => console.log(error));
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;
  
    if (!budget.eventID.trim()) {
      errors.eventID = "Event ID is required";
      isValid = false;
    }
  
    if (!budget.brideName.trim()) {
      errors.brideName = "Bride's Name is required";
      isValid = false;
    }
  
    if (!budget.packages) {
      errors.packages = "Package is required";
      isValid = false;
    }
  
    if (!budget.estimatedBudget) {
      errors.estimatedBudget = "Estimated Budget is required";
      isValid = false;
    } else if (isNaN(budget.estimatedBudget) || budget.estimatedBudget <= 0) {
      errors.estimatedBudget = "Estimated Budget must be a valid number";
      isValid = false;
    }
  
    setErrors(errors);
    return isValid;
  };
  

  const [state, setState] = useState({
    Venue: false,
    Catering: false,
    Photography: false,
    Outfit: false,
    Decorations: false,
    Transport: false,
  });

  const { Venue, Catering, Photography, Outfit, Decorations, Transport } =
    state;
  const error =
    [Venue, Catering, Photography, Outfit, Decorations, Transport].filter(
      (v) => v
    ).length !== 2;

    const packages = [
      {
        value: "Classic Elegance Package",
        label: "Classic Elegance Package",
      },
      {
        value: "Luxury Romance Package",
        label: "Luxury Romance Package",
      },
      {
        value: "Beach Bliss Package",
        label: "Beach Bliss Package",
      },
      {
        value: "Cultural Celebration Package",
        label: "Cultural Celebration Package",
      }
    ];

  return (
    <div className="addBudget">
      <Link to={"/displayBudgets"}>Back</Link>
      <h2>Add New Budget</h2>

      <form className="addBudgetForm" onSubmit={submitForm}>
        <div
          className="inputGroup"
          style={{ display: "flex", flexDirection: "row", columnGap: "10px" }}
        >
          <TextField
            required
            id="eventID"
            label="Event Name"
            onChange={inputHandler}
            name="eventID"
            error={errors.eventID ? true : false}
            helperText={errors.eventID}
          />

          <TextField
            id="groomName"
            label="Groom's Name"
            onChange={inputHandler}
            name="groomName"
            error={errors.groomName ? true : false}
            helperText={errors.groomName}
          />

          <TextField
            id="brideName"
            label="Bride's Name"
            onChange={inputHandler}
            name="brideName"
            error={errors.brideName ? true : false}
            helperText={errors.brideName}
          />
        </div>

        <div className="inputGroup">
          <FormLabel component="legend">Vendor Services</FormLabel>
          <FormGroup
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1px",
            }}
          >
            <FormControlLabel
              sx={{ width: "auto" }}
              control={
                <Checkbox
                  checked={Venue}
                  onChange={handleChange("Venue")}
                  name="Venue"
                />
              }
              label="Venue"
            />
            <FormControlLabel
              sx={{ width: "auto" }}
              control={
                <Checkbox
                  checked={Catering}
                  onChange={handleChange("Catering")}
                  name="Catering"
                />
              }
              label="Catering"
            />
            <FormControlLabel
              sx={{ width: "auto" }}
              control={
                <Checkbox
                  checked={Photography}
                  onChange={handleChange("Photography")}
                  name="Photography"
                />
              }
              label="Photography"
            />
            <FormControlLabel
              sx={{ width: "auto" }}
              control={
                <Checkbox
                  checked={Outfit}
                  onChange={handleChange("Outfit")}
                  name="Outfit"
                />
              }
              label="Outfit"
            />
            <FormControlLabel
              sx={{ width: "auto" }}
              control={
                <Checkbox
                  checked={Decorations}
                  onChange={handleChange("Decorations")}
                  name="Decorations"
                />
              }
              label="Decorations"
            />
            <FormControlLabel
              sx={{ width: "auto" }}
              control={
                <Checkbox
                  checked={Transport}
                  onChange={handleChange("Transport")}
                  name="Transport"
                />
              }
              label="Transport"
            />
          </FormGroup>
        </div>

        <div className="inputGroup" style={{ marginLeft: '20px' }}>
          <div className="flexContainer">
            <div>
              <TextField
                id="packages"
                select
                sx={{ width: '100%' }}
                label="Packages"
                defaultValue={packages[0].value}
                onChange={inputHandler}
                name="packages"
                error={errors.packages ? true : false}
                helperText={errors.packages}
              >
                {packages.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <div>
              <FormControl>
                <InputLabel htmlFor="outlined-adornment-amount">Estimated Budget</InputLabel>
                <OutlinedInput
                  id="estimatedBudget"
                  startAdornment={<InputAdornment position="start">LKR</InputAdornment>}
                  label="Amount"
                  onChange={inputHandler}
                  name="estimatedBudget"
                  error={errors.estimatedBudget ? true : false}
                  helperText={errors.estimatedBudget}
                />
              </FormControl>
            </div>
          </div>
        </div>

        <TextField
          id="additionalNotes"
          label="Additional Notes"
          multiline
          rows={4}
          fullWidth
          onChange={inputHandler}
          name="additionalNotes"
          sx={{ mb: 2 }}
        />

        <div className="inputGroup">
          <button className="submit">ADD BUDGET</button>
        </div>
      </form>
    </div>
  );
};

export default AddBudget;
