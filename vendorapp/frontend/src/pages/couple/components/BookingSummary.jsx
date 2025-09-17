import * as React from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import { Box, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchServiceDetailsFromInvoice } from '../../../redux/userSlice';

const BookingSummary = ({ handleNext, handleBack }) => {

    const dispatch = useDispatch();

    const params = useParams();
    const serviceID = params.id;

    const { currentUser, serviceDetailsInvoice } = useSelector((state) => state.user);

    React.useEffect(() => {
        if (serviceID) {
            dispatch(fetchServiceDetailsFromInvoice(serviceID));
        }
    }, [serviceID, dispatch]);

    let invoiceDetails = currentUser.invoiceDetails;
    let shippingData = currentUser.shippingData;

    const totalQuantity = invoiceDetails.reduce((total, item) => total + item.quantity, 0);
    const totalOGPrice = invoiceDetails.reduce((total, item) => total + (item.quantity * item.price.mrp), 0);
    const totalNewPrice = invoiceDetails.reduce((total, item) => total + (item.quantity * item.price.cost), 0);

    return (
        <React.Fragment>
            <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
                Booking summary
            </Typography>
            {serviceID ?
                <React.Fragment>
                    <List disablePadding>
                        <ListItem sx={{ py: 1, px: 0 }}>
                            <ListItemText primary={serviceDetailsInvoice.serviceName} secondary={`Quantity: ${serviceDetailsInvoice.quantity}`} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                {`LKR ${serviceDetailsInvoice.price && serviceDetailsInvoice.price.mrp * serviceDetailsInvoice.quantity}`}
                            </Typography>
                        </ListItem>
                        <ListItem sx={{ py: 1, px: 0 }}>
                            <ListItemText primary="Discount" />
                            <Typography variant="subtitle1" sx={{ color: "green" }}>
                                LKR {serviceDetailsInvoice.price && serviceDetailsInvoice.price.mrp - serviceDetailsInvoice.price.cost}
                            </Typography>
                        </ListItem>
                        <ListItem sx={{ py: 1, px: 0 }}>
                            <ListItemText primary="Shipping" />
                            <Typography variant="body2">
                                Free
                            </Typography>
                        </ListItem>
                        <ListItem sx={{ py: 1, px: 0 }}>
                            <ListItemText primary="Total Amount" />
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                LKR {serviceDetailsInvoice.price && serviceDetailsInvoice.price.cost * serviceDetailsInvoice.quantity}
                            </Typography>
                        </ListItem>
                    </List>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" gutterBottom sx={{ mt: 2, fontWeight: 700 }}>
                                Shipping
                            </Typography>
                            <Typography gutterBottom>{currentUser.name}</Typography>
                            <Typography gutterBottom>{shippingData.address},{shippingData.city},{shippingData.state},{shippingData.country}</Typography>
                        </Grid>
                    </Grid>
                </React.Fragment>
                :
                <React.Fragment>
                    <List disablePadding>
                        {invoiceDetails.map((service, index) => (
                            <ListItem key={index} sx={{ py: 1, px: 0 }}>
                                <ListItemText primary={service.serviceName} secondary={`Quantity: ${service.quantity}`} />
                                <Typography variant="body2">{`LKR ${service.quantity * service.price.mrp}`}</Typography>
                            </ListItem>
                        ))}
                        <ListItem sx={{ py: 1, px: 0 }}>
                            <ListItemText primary={`Price (${totalQuantity} items)`} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                LKR {totalOGPrice}
                            </Typography>
                        </ListItem>
                        <ListItem sx={{ py: 1, px: 0 }}>
                            <ListItemText primary="Discount" />
                            <Typography variant="subtitle1" sx={{ color: "green" }}>
                                LKR {totalOGPrice - totalNewPrice}
                            </Typography>
                        </ListItem>
                        <ListItem sx={{ py: 1, px: 0 }}>
                            <ListItemText primary="Shipping" />
                            <Typography variant="body2">
                                Free
                            </Typography>
                        </ListItem>
                        <ListItem sx={{ py: 1, px: 0 }}>
                            <ListItemText primary="Total Amount" />
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                LKR {totalNewPrice}
                            </Typography>
                        </ListItem>
                    </List>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" gutterBottom sx={{ mt: 2, fontWeight: 700 }}>
                                Shipping
                            </Typography>
                            <Typography gutterBottom>{currentUser.name}</Typography>
                            <Typography gutterBottom>{shippingData.address},{shippingData.city},{shippingData.state},{shippingData.country}</Typography>
                        </Grid>
                    </Grid>
                </React.Fragment>
            }
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                </Button>
                <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 3, ml: 1 }}
                >
                    Next
                </Button>
            </Box>
        </React.Fragment>
    );
}

export default BookingSummary