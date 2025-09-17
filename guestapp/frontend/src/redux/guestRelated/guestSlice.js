import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    guestsList: [],
    loading: false,
    error: null,
    response: null,
    statestatus: "idle",
};

const guestSlice = createSlice({
    name: 'guest',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        stuffDone: (state) => {
            state.loading = false;
            state.error = null;
            state.response = null;
            state.statestatus = "added";
        },
        getSuccess: (state, action) => {
            state.guestsList = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getFailed: (state, action) => {
            state.response = action.payload;
            state.loading = false;
            state.error = null;
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        underGuestControl: (state) => {
            state.loading = false;
            state.response = null;
            state.error = null;
            state.statestatus = "idle";
        }
    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    underGuestControl,
    stuffDone,
} = guestSlice.actions;

export const guestReducer = guestSlice.reducer;