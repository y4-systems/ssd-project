import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ service }) => {

    const navigate = useNavigate();

    return (
        <Card>
            <Box sx={{ pt: '100%', position: 'relative' }}>
                <Box
                    component="img"
                    alt={service.serviceName}
                    src={service.serviceImage}
                    sx={{
                        top: 0,
                        height: 1,
                        objectFit: 'cover',
                        position: 'absolute',
                    }}
                />
            </Box>

            <Stack spacing={2} sx={{ p: 3, cursor: "pointer" }}>
                <Link
                    color="inherit"
                    underline="hover"
                    variant="subtitle2"
                    noWrap
                    onClick={() => navigate("/booking/view/" + service._id)}
                    sx={{ fontWeight: 700 }}
                >
                    {service.serviceName}
                </Link>

                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle1">
                        <Typography
                            component="span"
                            variant="body1"
                            sx={{
                                color: 'text.disabled',
                                textDecoration: 'line-through',
                            }}
                        >
                            {service.price && service.price.mrp}
                        </Typography>
                    </Typography>
                    <Typography variant="subtitle1">
                        LKR {service.price && service.price.cost}
                    </Typography>
                </Stack>
            </Stack>
        </Card >
    );
}

ServiceCard.propTypes = {
    service: PropTypes.object,
};

export default ServiceCard