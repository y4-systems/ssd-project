import { Box } from "@mui/material";
import FeedbackTable from "./FeedbackTable";
import Axios from "axios";
import { useEffect, useState } from "react";


const AdminFeedbackView = () => {

    //const [selectedFeedback, setSelectedFeedback] = useState({});
    const [feedback, setFeedback] = useState([]);
    //const [submitted, setSubmitted] = useState(false);

    //run first
    useEffect(() => {
        getFeedback();
    }, []);

    const getFeedback = () => {
        Axios.get('http://localhost:3001/api/feedbacks') //request data from backend
            .then(response => {
                setFeedback(response.data?.response || []); //response is the data 
            })
            .catch(error => {
                console.error("Axios Error: ", error);
            });

    }

    const deleteFeedback = (data) => {
        Axios.post('http://localhost:3001/api/deleteFeedback', data) //request data from backend
            .then(() => {
                getFeedback();
            })
            .catch(error => {
                console.error("Axios Error: ", error);
            });
    }

    return (
        <Box>
            <FeedbackTable
                rows={feedback}
                selectedFeedback={data => {

                }}

                deleteFeedback={data => window.confirm('Are you sure?') && deleteFeedback(data)}

            />
        </Box>
    )
}

export default AdminFeedbackView;