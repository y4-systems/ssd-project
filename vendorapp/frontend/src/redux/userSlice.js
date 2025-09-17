import { createSlice } from '@reduxjs/toolkit';
import jwtDecode from 'jwt-decode';

const initialState = {
    status: 'idle',
    loading: false,
    currentUser: JSON.parse(localStorage.getItem('user')) || null,
    currentRole: (JSON.parse(localStorage.getItem('user')) || {}).role || null,
    currentToken: (JSON.parse(localStorage.getItem('user')) || {}).token || null,
    isLoggedIn: false,
    error: null,
    response: null,

    responseReview: null,
    responseServices: null,
    responseVendorServices: null,
    responseSpecificServices: null,
    responseDetails: null,
    responseSearch: null,
    responseCouplesList: null,

    serviceData: [],
    vendorServiceData: [],
    specificServiceData: [],
    serviceDetails: {},
    serviceDetailsInvoice: {},
    filteredServices: [],
    couplesList: [],
};

const updateInvoiceDetailsInLocalStorage = (invoiceDetails) => {
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
    currentUser.invoiceDetails = invoiceDetails;
    localStorage.setItem('user', JSON.stringify(currentUser));
};

export const updateShippingDataInLocalStorage = (shippingData) => {
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
    const updatedUser = {
        ...currentUser,
        shippingData: shippingData
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        authRequest: (state) => {
            state.status = 'loading';
        },
        underControl: (state) => {
            state.status = 'idle';
            state.response = null;
        },
        stuffAdded: (state) => {
            state.status = 'added';
            state.response = null;
            state.error = null;
        },
        stuffUpdated: (state) => {
            state.status = 'updated';
            state.response = null;
            state.error = null;
        },
        updateFailed: (state, action) => {
            state.status = 'failed';
            state.responseReview = action.payload;
            state.error = null;
        },
        updateCurrentUser: (state, action) => {
            state.currentUser = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        authSuccess: (state, action) => {
            localStorage.setItem('user', JSON.stringify(action.payload));
            state.currentUser = action.payload;
            state.currentRole = action.payload.role;
            state.currentToken = action.payload.token;
            state.status = 'success';
            state.response = null;
            state.error = null;
            state.isLoggedIn = true;
        },
        addToInvoice: (state, action) => {
            const existingService = state.currentUser.invoiceDetails.find(
                (invoiceItem) => invoiceItem._id === action.payload._id
            );

            if (existingService) {
                existingService.quantity += 1;
            } else {
                const newInvoiceItem = { ...action.payload };
                state.currentUser.invoiceDetails.push(newInvoiceItem);
            }

            updateInvoiceDetailsInLocalStorage(state.currentUser.invoiceDetails);
        },
        removeFromInvoice: (state, action) => {
            const existingService = state.currentUser.invoiceDetails.find(
                (invoiceItem) => invoiceItem._id === action.payload._id
            );

            if (existingService) {
                if (existingService.quantity > 1) {
                    existingService.quantity -= 1;
                } else {
                    const index = state.currentUser.invoiceDetails.findIndex(
                        (invoiceItem) => invoiceItem._id === action.payload._id
                    );
                    if (index !== -1) {
                        state.currentUser.invoiceDetails.splice(index, 1);
                    }
                }
            }

            updateInvoiceDetailsInLocalStorage(state.currentUser.invoiceDetails);
        },

        removeSpecificService: (state, action) => {
            const serviceIdToRemove = action.payload;
            const updatedInvoiceDetails = state.currentUser.invoiceDetails.filter(
                (invoiceItem) => invoiceItem._id !== serviceIdToRemove
            );

            state.currentUser.invoiceDetails = updatedInvoiceDetails;
            updateInvoiceDetailsInLocalStorage(updatedInvoiceDetails);
        },

        fetchServiceDetailsFromInvoice: (state, action) => {
            const serviceIdToFetch = action.payload;
            const serviceInInvoice = state.currentUser.invoiceDetails.find(
                (invoiceItem) => invoiceItem._id === serviceIdToFetch
            );

            if (serviceInInvoice) {
                state.serviceDetailsInvoice = { ...serviceInInvoice };
            } else {
                state.serviceDetailsInvoice = null;
            }
        },

        removeAllFromInvoice: (state) => {
            state.currentUser.invoiceDetails = [];
            updateInvoiceDetailsInLocalStorage([]);
        },

        authFailed: (state, action) => {
            state.status = 'failed';
            state.response = action.payload;
            state.error = null;
        },
        authError: (state, action) => {
            state.status = 'error';
            state.response = null;
            state.error = action.payload;
        },
        authLogout: (state) => {
            localStorage.removeItem('user');
            state.status = 'idle';
            state.loading = false;
            state.currentUser = null;
            state.currentRole = null;
            state.currentToken = null;
            state.error = null;
            state.response = true;
            state.isLoggedIn = false;
        },

        isTokenValid: (state) => {
            const decodedToken = jwtDecode(state.currentToken);

            if (state.currentToken && decodedToken.exp * 1000 > Date.now()) {
                state.isLoggedIn = true;
            } else {
                localStorage.removeItem('user');
                state.currentUser = null;
                state.currentRole = null;
                state.currentToken = null;
                state.status = 'idle';
                state.response = null;
                state.error = null;
                state.isLoggedIn = false;
            }
        },

        getRequest: (state) => {
            state.loading = true;
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

        getDeleteSuccess: (state) => {
            state.status = 'deleted';
            state.loading = false;
            state.error = null;
            state.response = null;
        },

        serviceSuccess: (state, action) => {
            state.serviceData = action.payload;
            state.responseServices = null;
            state.loading = false;
            state.error = null;
        },
        getServicesFailed: (state, action) => {
            state.responseServices = action.payload;
            state.loading = false;
            state.error = null;
        },

        vendorServiceSuccess: (state, action) => {
            state.vendorServiceData = action.payload;
            state.responseVendorServices = null;
            state.loading = false;
            state.error = null;
        },
        getVendorServicesFailed: (state, action) => {
            state.responseVendorServices = action.payload;
            state.loading = false;
            state.error = null;
        },

        specificServiceSuccess: (state, action) => {
            state.specificServiceData = action.payload;
            state.responseSpecificServices = null;
            state.loading = false;
            state.error = null;
        },
        getSpecificServicesFailed: (state, action) => {
            state.responseSpecificServices = action.payload;
            state.loading = false;
            state.error = null;
        },

        serviceDetailsSuccess: (state, action) => {
            state.serviceDetails = action.payload;
            state.responseDetails = null;
            state.loading = false;
            state.error = null;
        },
        getServiceDetailsFailed: (state, action) => {
            state.responseDetails = action.payload;
            state.loading = false;
            state.error = null;
        },

        couplesListSuccess: (state, action) => {
            state.couplesList = action.payload;
            state.responseCouplesList = null;
            state.loading = false;
            state.error = null;
        },

        getCouplesListFailed: (state, action) => {
            state.responseCouplesList = action.payload;
            state.loading = false;
            state.error = null;
        },

        setFilteredServices: (state, action) => {
            state.filteredServices = action.payload;
            state.responseSearch = null;
            state.loading = false;
            state.error = null;
        },
        getSearchFailed: (state, action) => {
            state.responseSearch = action.payload;
            state.loading = false;
            state.error = null;
        },
    },
});

export const {
    authRequest,
    underControl,
    stuffAdded,
    stuffUpdated,
    updateFailed,
    authSuccess,
    authFailed,
    authError,
    authLogout,
    isTokenValid,
    doneSuccess,
    getDeleteSuccess,
    getRequest,
    serviceSuccess,
    vendorServiceSuccess,
    serviceDetailsSuccess,
    getServicesFailed,
    getVendorServicesFailed,
    getServiceDetailsFailed,
    getFailed,
    getError,
    getSearchFailed,
    setFilteredServices,
    getCouplesListFailed,
    couplesListSuccess,
    getSpecificServicesFailed,
    specificServiceSuccess,

    addToInvoice,
    removeFromInvoice,
    removeSpecificService,
    removeAllFromInvoice,
    fetchServiceDetailsFromInvoice,
    updateCurrentUser,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
