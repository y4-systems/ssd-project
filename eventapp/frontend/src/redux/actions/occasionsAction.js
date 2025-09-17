import { message } from "antd";
import axios from "axios";

export const getAllOccasions = () => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });

  try {
    const response = await axios.get("/api/occasions/getalloccasions");
    dispatch({ type: "GET_ALL_OCCASIONS", payload: response.data.occasions });
    dispatch({ type: "LOADING", payload: false });
  } catch (error) {
    console.log(error);
    dispatch({ type: "LOADING", payload: false });
  }
};

export const addOccasion = (reqObj) => async (dispatch) => {
  console.log(reqObj);
  dispatch({ type: "LOADING", payload: true });

  try {
    await axios.post("/api/occasions/addoccasion", reqObj);

    dispatch({ type: "LOADING", payload: false });
    message.success("New occasion added succesfully");
    setTimeout(() => {
      window.location.href = "/admin";
    }, 500);
  } catch (error) {
    console.log(error);
    dispatch({ type: "LOADING", payload: false });
  }
};

export const deleteOccasion = (reqObj) => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });

  try {
    await axios.delete(`/api/occasions/deleteoccasion/${reqObj.occasionid}`, reqObj);

    dispatch({ type: "LOADING", payload: false });
    message.success("Occasion Deleted Succesfully");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  } catch (error) {
    console.log(error);
    dispatch({ type: "LOADING", payload: false });
  }
};
