import axios from "axios";
import {
  authRequest,
  authSuccess,
  authFailed,
  authError,
  stuffAdded,
  getDeleteSuccess,
  getRequest,
  getFailed,
  getError,
  serviceSuccess,
  serviceDetailsSuccess,
  getServiceDetailsFailed,
  getServicesFailed,
  setFilteredServices,
  getSearchFailed,
  vendorServiceSuccess,
  getVendorServicesFailed,
  stuffUpdated,
  updateFailed,
  getCouplesListFailed,
  couplesListSuccess,
  getSpecificServicesFailed,
  specificServiceSuccess,
  updateCurrentUser,
} from "./userSlice";

const REACT_APP_BASE_URL = "http://localhost:5001";
export const authUser = (fields, role, mode) => async (dispatch) => {
  dispatch(authRequest());

  try {
    const result = await axios.post(
      `${REACT_APP_BASE_URL}/${role}${mode}`,
      fields,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (result.data.role) {
      dispatch(authSuccess(result.data));
    } else {
      dispatch(authFailed(result.data.message));
    }
  } catch (error) {
    dispatch(authError(error));
  }
};

export const addStuff = (address, fields) => async (dispatch) => {
  dispatch(authRequest());

  try {
    const result = await axios.post(
      `${REACT_APP_BASE_URL}/${address}`,
      fields,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (result.data.message) {
      dispatch(authFailed(result.data.message));
    } else {
      dispatch(stuffAdded());
    }
  } catch (error) {
    dispatch(authError(error));
  }
};

export const updateStuff = (fields, id, address) => async (dispatch) => {
  try {
    const result = await axios.put(
      `${REACT_APP_BASE_URL}/${address}/${id}`,
      fields,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (result.data.message) {
      dispatch(updateFailed(result.data.message));
    } else {
      dispatch(stuffUpdated());
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const deleteStuff = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.delete(`${REACT_APP_BASE_URL}/${address}/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getDeleteSuccess());
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const updateCouple = (fields, id) => async (dispatch) => {
  dispatch(updateCurrentUser(fields));

  const newFields = { ...fields };
  delete newFields.token;

  try {
    await axios.put(`${REACT_APP_BASE_URL}/CoupleUpdate/${id}`, newFields, {
      headers: { "Content-Type": "application/json" },
    });

    dispatch(stuffUpdated());
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getServicesbyVendor = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${REACT_APP_BASE_URL}/getVendorServices/${id}`
    );
    if (result.data.message) {
      dispatch(getVendorServicesFailed(result.data.message));
    } else {
      dispatch(vendorServiceSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getServices = () => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(`${REACT_APP_BASE_URL}/getServices`);
    if (result.data.message) {
      dispatch(getServicesFailed(result.data.message));
    } else {
      dispatch(serviceSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getServiceDetails = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${REACT_APP_BASE_URL}/getServiceDetail/${id}`
    );
    if (result.data.message) {
      dispatch(getServiceDetailsFailed(result.data.message));
    } else {
      dispatch(serviceDetailsSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getCouples = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(`${REACT_APP_BASE_URL}/${address}/${id}`);
    if (result.data.message) {
      dispatch(getCouplesListFailed(result.data.message));
    } else {
      dispatch(couplesListSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getSpecificServices = (id, address) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${REACT_APP_BASE_URL}/${address}/${id}`);
    if (result.data.message) {
      dispatch(getSpecificServicesFailed(result.data.message));
    } else {
      dispatch(specificServiceSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getSearchedServices = (address, key) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(`${REACT_APP_BASE_URL}/${address}/${key}`);
    if (result.data.message) {
      dispatch(getSearchFailed(result.data.message));
    } else {
      dispatch(setFilteredServices(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};
