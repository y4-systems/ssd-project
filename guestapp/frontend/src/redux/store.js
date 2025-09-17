import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './userRelated/userSlice';
import { guestReducer } from './guestRelated/guestSlice';
import { noticeReducer } from './noticeRelated/noticeSlice';
import { stableReducer } from './stableRelated/stableSlice';
import { vendorReducer } from './vendorRelated/vendorSlice';
import { coupleReducer } from './coupleRelated/coupleSlice';
import { complainReducer } from './complainRelated/complainSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        guest: guestReducer,
        vendor: vendorReducer,
        couple: coupleReducer,
        notice: noticeReducer,
        complain: complainReducer,
        stable: stableReducer
    },
});

export default store;
