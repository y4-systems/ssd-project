import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Box, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userHandle';
import { useNavigate, useParams } from 'react-router-dom';
import Popup from '../../../components/Popup';
import { fetchServiceDetailsFromInvoice, removeAllFromInvoice, removeSpecificService } from '../../../redux/userSlice';

const PaymentForm = ({ handleBack }) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { status, currentUser, serviceDetailsInvoice } = useSelector(state => state.user);

    const params = useParams();
    const serviceID = params.id;

    const [paymentData, setPaymentData] = useState({
        cardName: '',
        cardNumber: '',
        expDate: '',
        cvv: '',
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setPaymentData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (serviceID) {
            dispatch(fetchServiceDetailsFromInvoice(serviceID));
        }
    }, [serviceID, dispatch]);

    const servicesQuantity = currentUser.invoiceDetails.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = currentUser.invoiceDetails.reduce((total, item) => total + (item.quantity * item.price.cost), 0);

    const singleServiceQuantity = serviceDetailsInvoice && serviceDetailsInvoice.quantity
    const totalsingleServicePrice = serviceDetailsInvoice && serviceDetailsInvoice.price && serviceDetailsInvoice.price.cost * serviceDetailsInvoice.quantity

    const paymentID = `${paymentData.cardNumber.slice(-4)}-${paymentData.expDate.slice(0, 2)}${paymentData.expDate.slice(-2)}-${Date.now()}`;
    const paymentInfo = { id: paymentID, status: "Successful" }

    const multiBookingData = {
        buyer: currentUser._id,
        shippingData: currentUser.shippingData,
        bookingedServices: currentUser.invoiceDetails,
        paymentInfo,
        servicesQuantity,
        totalPrice,
    }

    const singleBookingData = {
        buyer: currentUser._id,
        shippingData: currentUser.shippingData,
        bookingedServices: serviceDetailsInvoice,
        paymentInfo,
        servicesQuantity: singleServiceQuantity,
        totalPrice: totalsingleServicePrice,
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (serviceID) {
            dispatch(addStuff("newBooking", singleBookingData));
            dispatch(removeSpecificService(serviceID));
        }
        else {
            dispatch(addStuff("newBooking", multiBookingData));
            dispatch(removeAllFromInvoice());
        }
    };

    useEffect(() => {
        if (status === 'added') {
            navigate('/Aftermath');
        }
        else if (status === 'failed') {
            setMessage("Booking Failed")
            setShowPopup(true)
        }
        else if (status === 'error') {
            setMessage("Network Error")
            setShowPopup(true)
        }
    }, [status, navigate]);

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Payment method
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            id="cardName"
                            label="Name on card"
                            fullWidth
                            autoComplete="cc-name"
                            variant="standard"
                            value={paymentData.cardName}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            id="cardNumber"
                            label="Card number"
                            type='number'
                            fullWidth
                            autoComplete="cc-number"
                            variant="standard"
                            value={paymentData.cardNumber}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            id="expDate"
                            type='date'
                            helperText="Expiry date"
                            fullWidth
                            autoComplete="cc-exp"
                            variant="standard"
                            value={paymentData.expDate}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            id="cvv"
                            label="CVV"
                            type='number'
                            helperText="Last three digits on signature strip"
                            fullWidth
                            autoComplete="cc-csc"
                            variant="standard"
                            value={paymentData.cvv}
                            onChange={handleInputChange}
                        />
                    </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        type='submit'
                        sx={{ mt: 3, ml: 1 }}
                    >
                        Place booking
                    </Button>
                </Box>
            </form>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </React.Fragment>
    );
}

export default PaymentForm;
