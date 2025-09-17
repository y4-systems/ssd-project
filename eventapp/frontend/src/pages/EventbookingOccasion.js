import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useSelector, useDispatch } from "react-redux";
import { getAllOccasions } from "../redux/actions/occasionsAction";
import { Link, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import {
  Row,
  Col,
  Divider,
  DatePicker,
  Checkbox,
  Button,
  Modal,
  message,
} from "antd";
import moment from "moment";
import { bookOccasion } from "../redux/actions/eventbookingActions";
import dayjs from "dayjs";
import "aos/dist/aos.css";
import axios from "axios";

const { RangePicker } = DatePicker;
function EventbookingOccasion({ match }) {
  const { occasionid } = useParams();
  const { occasions } = useSelector((state) => state.occasionReducer);
  const { loading } = useSelector((state) => state.alertsReducer);
  const [occasion, setoccasion] = useState({});
  const dispatch = useDispatch();
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [totalHours, setTotalHours] = useState(0);
  const [driver, setdriver] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    if (occasions.length == 0) {
      dispatch(getAllOccasions());
    } else {
      setoccasion(occasions.find((o) => o._id == occasionid));
    }
  }, [occasions]);

  useEffect(() => {
    setTotalAmount(totalHours * occasion.rentPerHour);
    if (driver) {
      setTotalAmount(totalAmount + totalHours * 500);
    }
  }, [driver, totalHours]);

  function selectTimeSlots(values) {
    setFrom(dayjs(values[0]).format("MMM DD YYYY HH:mm"));
    setTo(dayjs(values[1]).format("MMM DD YYYY HH:mm"));
    setTotalHours(values[1].diff(values[0], "hours"));
  }

  function bookNow() {
    const reqObj = {
      user: JSON.parse(localStorage.getItem("user"))._id,
      occasion: occasion._id,
      totalHours,
      totalAmount,
      driverRequired: driver,
      bookedTimeSlots: {
        from,
        to,
      },
    };
    dispatch(bookOccasion(reqObj));
  }

  //Popup Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [timeSlots, setTimeSlots] = useState([]);

  //Get time slots
  const getTimeSlots = () => {
    axios
      .get(`/api/eventbookings/getoccasioneventbookings/${occasionid}`)
      .then((res) => {
        setTimeSlots(res.data.eventbookings);
      });
  };

  useEffect(() => {
    getTimeSlots();
  }, []);

  return (
    <DefaultLayout>
      {loading && <Spinner />}
      <Row
        justify="center"
        className="d-flex align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <Col lg={10} sm={24} xs={24}>
          <img
            src={occasion.image}
            className="carimg2 bs1 w-100"
            data-aos="flip-left"
            data-aos-duration="1500"
          />
        </Col>

        <Col lg={10} sm={24} xs={24} className="text-right">
          <div
            style={{
              width: "60%",
              margin: "auto",
            }}
          >
            <Divider
              type="horizontal"
              dashed
              style={{
                letterSpacing: "2px",
              }}
            >
              Event Details
            </Divider>
            <hr
              style={{
                border: "1px solid #FF0000",
                width: "100%",
                margin: "auto",
              }}
            />
            <div
              style={{
                textAlign: "left",
                marginTop: "20px",
                width: "100%",
              }}
            >
              <p>
                <strong>Event Name: </strong>
                {occasion.name}
              </p>
              <p>
                <strong>Event Category: </strong>
                {occasion.category}
              </p>
              <p>
                <strong>Event Average Cost: </strong>
                {occasion.rentPerHour} LKR
              </p>
              <p>
                <strong>Location: </strong>
                {occasion.location}
              </p>
              <p>
                <strong>Guest Count: </strong>
                {occasion.capacity} Persons
              </p>
            </div>

            <Divider type="horizontal" dashed>
              Time Slots
            </Divider>
            <RangePicker
              showTime={{ format: "HH:mm" }}
              format="MMM DD YYYY HH:mm"
              onChange={selectTimeSlots}
            />
            <br />

            <button
              onClick={showModal}
              className="btn1 mt-3"
              style={{
                backgroundColor: "#FF0000",
                color: "white",
                borderRadius: "10px",
                padding: "10px",
                border: "none",
                marginBottom: "10px",
              }}
            >
              Confirm
            </button>
            <Modal
              title="Time Slots"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <h4>Booked Times</h4>

              {timeSlots.length <= 0 ? (
                <div>No Booked Slots</div>
              ) : (
                <div>
                  {timeSlots.map((slot) => {
                    return (
                      <div className="mt-4">
                        <p>
                          <strong>From: </strong>
                          {moment(slot.from).format("MMM DD YYYY HH:mm A")}
                        </p>
                        <p>
                          <strong>To: </strong>
                          {moment(slot.to).format("MMM DD YYYY HH:mm A")}
                        </p>
                        <hr />
                      </div>
                    );
                  })}
                </div>
              )}
            </Modal>

            {from && to && (
              <div>
                <p>
                  Total Hours : <b>{totalHours}</b>
                </p>
                <p>
                  Estimated Budget : <b>{occasion.rentPerHour} LKR</b>
                </p>
                <Checkbox
                  style={{ marginBottom: "20px" }}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setdriver(true);
                    } else {
                      setdriver(false);
                    }
                  }}
                >
                  Additional Event Manager(s) Required
                </Checkbox>

                <p
                  style={{
                    marginTop: "10px",
                    textAlign: "left",
                    fontStyle: "italic",
                    fontSize: "20px",
                  }}
                >
                  <strong>Total Amount : </strong>
                  {totalAmount} LKR
                </p>

                <button
                  onClick={bookNow}
                  style={{
                    backgroundColor: "#4d1c9c",
                    color: "white",
                    borderRadius: "10px",
                    padding: "7px 40px",
                    border: "none",
                    marginTop: "20px",
                  }}
                >
                  Confirm Now
                </button>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </DefaultLayout>
  );
}

export default EventbookingOccasion;
