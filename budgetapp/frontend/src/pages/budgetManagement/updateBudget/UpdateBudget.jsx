import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "../addBudget/addbudget.css";
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

const UpdateBudget = () => {
  const budgets = {
    eventID: "",
    groomName: "",
    brideName: "",
    packages: "Customized",
    estimatedBudget: "",
    additionalNotes: "",
    Venue: false,
    Catering: false,
    Photography: false,
    Outfit: false,
    Decorations: false,
    Transport: false,
  };

  const { id } = useParams();
  const navigate = useNavigate();
  const [budget, setBudget] = useState(budgets);

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setBudget((prevBudget) => ({ ...prevBudget, [name]: value }));
    console.log(budget);
  };

  const [state, setState] = useState({
    Venue: false,
    Catering: false,
    Photography: false,
    Outfit: false,
    Decorations: false,
    Transport: false,
  });

  const handleChangeUpdate = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.checked,
    });
    setBudget((prevBudget) => ({ ...prevBudget, [name]: e.target.checked }));
  };

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

  const submitForm = async (e) => {
    e.preventDefault();
    const vendorServices = Object.entries(state)
        .filter(([key, value]) => value)
        .map(([key]) => key);
    const budgetToSend = {
      ...budget,
      vendorServices,
    };
    await axios
        .put(`http://localhost:8000/api/updateBudget/${id}`, budgetToSend)
        .then((response) => {
          toast.success(response.data.msg, { position: "top-right" });
          navigate("/displayBudgets");
        })
        .catch((error) => console.log(error));
  };

  useEffect(() => {
    axios
        .get(`http://localhost:8000/api/getOneBudget/${id}`)
        .then((response) => {
          const fetchedBudget = response.data;
          setBudget(fetchedBudget);
          const vendorServicesState = {
            Venue: false,
            Catering: false,
            Photography: false,
            Outfit: false,
            Decorations: false,
            Transport: false,
          };
          fetchedBudget.vendorServices.forEach((service) => {
            if (vendorServicesState.hasOwnProperty(service)) {
              vendorServicesState[service] = true;
            }
          });
          setState(vendorServicesState);
        })
        .catch((error) => {
          console.log(error);
        });
  }, [id]);

  return (
    <div className="addBudget">
      <Link to={"/displayBudgets"}>Back</Link>
      <h2>Update Budget</h2>

      <form className="addBudgetForm" onSubmit={submitForm}>
      <div
          className="inputGroup"
          style={{ display: "flex", flexDirection: "row", columnGap: "10px" }}
        >
          <TextField
            value={budget.eventID}
            onChange={inputChangeHandler}
            id="eventID"
            label="Event Name/ID"
            name="eventID"
          />
          <TextField
            id="groomName"
            label="Groom's Name"
            value={budget.groomName}
            onChange={inputChangeHandler}
            name="groomName"
          />
          <TextField
            id="brideName"
            label="Bride's Name"
            value={budget.brideName}
            onChange={inputChangeHandler}
            name="brideName"
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
            {Object.keys(state).map((name) => (
              <FormControlLabel
                key={name}
                sx={{ width: "auto" }}
                control={
                  <Checkbox
                    checked={state[name]}
                    onChange={handleChangeUpdate(name)}
                    name={name}
                  />
                }
                label={name}
              />
            ))}
          </FormGroup>
        </div>

        <div className="inputGroup" style={{ marginLeft: "20px" }}>
          <div className="flexContainer">
            <div>
              <TextField
                id="packages"
                sx={{width: '100%'}}
                select
                label="Packages"
                value={budget.packages}
                onChange={inputChangeHandler}
                name="packages"
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
                <InputLabel htmlFor="outlined-adornment-amount">
                  Estimated Budget
                </InputLabel>
                <OutlinedInput
                  id="estimatedBudget"
                  startAdornment={
                    <InputAdornment position="start">LKR</InputAdornment>
                  }
                  label="Amount"
                  value={budget.estimatedBudget}
                  onChange={inputChangeHandler}
                  name="estimatedBudget"
                />
              </FormControl>
            </div>
          </div>
        </div>

        <div className="inputGroup">
          <TextField
            id="additionalNotes"
            label="Additional Notes"
            multiline
            rows={4}
            fullWidth
            value={budget.additionalNotes}
            onChange={inputChangeHandler}
            name="additionalNotes"
          />
        </div>

        <div className="inputGroup">
          <button className="submit" type="submit">
            UPDATE BUDGET
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBudget;
