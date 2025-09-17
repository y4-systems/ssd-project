import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stableesList: [],
  stableGuests: [],
  stableDetails: [],
  preferencesList: [],
  preferenceDetails: [],
  loading: false,
  subloading: false,
  error: null,
  response: null,
  getresponse: null,
};

const stableSlice = createSlice({
  name: "stable",
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    getSubDetailsRequest: (state) => {
      state.subloading = true;
    },
    getSuccess: (state, action) => {
      state.stableesList = action.payload;
      state.loading = false;
      state.error = null;
      state.getresponse = null;
    },
    getGuestsSuccess: (state, action) => {
      state.stableGuests = action.payload;
      state.loading = false;
      state.error = null;
      state.getresponse = null;
    },
    getPreferencesSuccess: (state, action) => {
      state.preferencesList = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getFailed: (state, action) => {
      state.preferencesList = [];
      state.response = action.payload;
      state.loading = false;
      state.error = null;
    },
    getFailedTwo: (state, action) => {
      state.stableesList = [];
      state.stableGuests = [];
      state.getresponse = action.payload;
      state.loading = false;
      state.error = null;
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    detailsSuccess: (state, action) => {
      state.stableDetails = action.payload;
      state.loading = false;
      state.error = null;
    },
    getSubDetailsSuccess: (state, action) => {
      state.preferenceDetails = action.payload;
      state.subloading = false;
      state.error = null;
    },
    resetPreferences: (state) => {
      state.preferencesList = [];
      state.stableesList = [];
    },
  },
});

export const {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  getGuestsSuccess,
  getPreferencesSuccess,
  detailsSuccess,
  getFailedTwo,
  resetPreferences,
  getSubDetailsSuccess,
  getSubDetailsRequest,
} = stableSlice.actions;

export const stableReducer = stableSlice.reducer;
