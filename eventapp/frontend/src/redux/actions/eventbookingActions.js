import axios from "axios";
import { message } from "antd";

export const bookOccasion = (reqObj) => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });

  try {
    await axios.post("/api/eventbookings/bookoccasion", reqObj);
    dispatch({ type: "LOADING", payload: false });

    setTimeout(() => {
      message.success("Your Occasion booked Successfull");
      window.location.href = "/usereventbookings";
    }, 500);
  } catch (error) {
    console.log(error);
    dispatch({ type: "LOADING", payload: false });
    message.error("something went wrong.please try again later");
  }
};

export const getAllEventbookings = () => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });

  try {
    const response = await axios.get("/api/eventbookings/getalleventbookings");
    dispatch({
      type: "GET_ALL_BOOKINGS",
      payload: response.data.eventbookings,
    });
    dispatch({ type: "LOADING", payload: false });
  } catch (error) {
    console.log(error);
    dispatch({ type: "LOADING", payload: false });
  }
};
