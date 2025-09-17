import React from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";

const UserView = ({ rows, selectedFeedback, deleteFeedback }) => {
    return (
        <div>
            <Typography variant="h4" sx={{fontWeight: 'bold', color: '#4643FF', marginBottom: '20px', marginTop: '20px', textAlign: 'center' }}>Previous Feedbacks</Typography>
            
            {rows.map(row => (
                <Card key={row.id} sx={{ 
                    position: 'relative', 
                    marginBottom: '20px', 
                    marginLeft: '40px', 
                    marginRight: '40px',
                    borderRadius: '20px',
                    backgroundColor: '#f0f0f0',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 12px rgba(0,0,0,0.2)',
                    },
                }}>
                    <CardContent>
                        <Typography>Rating: {row.rating}</Typography>
                        <Typography>Feedback: {row.feedback}</Typography>
                        <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
                            <Button
                                sx={{
                                    borderRadius: '20px',
                                    backgroundColor: '#CBC3E3',
                                    color: '#000',
                                    '&:hover': {
                                        backgroundColor: '#A020F0',
                                    },
                                }}
                                onClick={() => selectedFeedback({ id: row.id, User_ID: row.User_ID, name: row.name, email: row.email,  rating: row.rating, feedback: row.feedback })}
                            >
                                Update
                            </Button>
                            <Button
                                sx={{
                                    ml: 2,
                                    borderRadius: '20px',
                                    backgroundColor: '#FF0000',
                                    color: '#FFF',
                                    '&:hover': {
                                        backgroundColor: '#B71C1C',
                                    },
                                }}
                                onClick={() => deleteFeedback({ id: row.id })}
                            >
                                Delete
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default UserView;
