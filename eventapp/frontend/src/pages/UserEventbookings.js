import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllEventbookings } from "../redux/actions/eventbookingActions";
import { Col, Pagination, Popconfirm, Row, message } from "antd";
import dayjs from "dayjs";
import Spinner from "../components/Spinner";
import axios from "axios";
import moment from "moment";

function UserEventbookings() {
  const dispatch = useDispatch();
  const { eventbookings } = useSelector((state) => state.eventbookingsReducer);
  const user = JSON.parse(localStorage.getItem("user"));
  const { loading } = useSelector((state) => state.alertsReducer);

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getAllEventbookings());
  }, []);

  //Get the array length of the filtered occasions
  const occasionsLength = eventbookings.filter(
    (eventbooking) => eventbooking.user._id == user._id
  ).length;

  //Pagination
  const handlePaginationChange = (value) => {
    if (value == 1) {
      setPage(1);
    } else {
      setPage(value);
    }
  };

  const deleteHandler = (id) => {
    axios
      .delete(`/api/eventbookings/deleteeventbooking/${id}`)
      .then((res) => {
        message.success("Occasion Deleted Succesfully");
        setTimeout(() => {
          window.location.href = "/usereventbookings";
        }, 500);
      })
      .catch((err) => {
        message.error("Something went wrong");
      });
  };

  return (
    <DefaultLayout>
      {loading && <Spinner />}

      <h3 className="text-center mt-4 mb-4">My Eventbookings</h3>

      <Row justify={"center"} gutter={16}>
        <Col
          lg={24}
          sm={24}
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "40px",
          }}
        >
          {eventbookings.filter(
            (eventbooking) => eventbooking.user._id == user._id
          ).length == 0 ? (
            <h6 className="text-center mt-4 mb-4">
              You have not booked any occasions yet
            </h6>
          ) : (
            eventbookings
              .filter((eventbooking) => eventbooking.user._id == user._id)
              .slice((page - 1) * 4, page * 4)
              .map((eventbooking) => {
                return (
                  <div
                    style={{
                      boxShadow:
                        "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
                      borderRadius: "20px",
                      width: "600px",
                      display: "flex",
                      flexDirection: "row",
                      height: "200px",
                    }}
                  >
                    <div
                      style={{
                        width: "250px",
                        height: "200px",
                      }}
                    >
                      <img
                        src={eventbooking.occasion.image}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "20px 0px 0px 20px",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        textAlign: "left",
                        padding: "10px 20px",
                        fontSize: "12px",
                      }}
                    >
                      <h5>{eventbooking.occasion.name}</h5>
                      <p>
                        From :{" "}
                        <b>
                          {moment(eventbooking.bookedTimeSlots.from).format(
                            "MMM DD YYYY HH:mm A"
                          )}
                        </b>
                      </p>
                      <p>
                        To :{" "}
                        <b>
                          {" "}
                          {moment(eventbooking.bookedTimeSlots.to).format(
                            "MMM DD YYYY HH:mm A"
                          )}
                        </b>
                      </p>
                      <p>
                        Booked Date :{" "}
                        <b>
                          {dayjs(eventbooking.createdAt).format("MMM DD YYYY")}
                        </b>
                      </p>
                      <p>
                        <b>Total Amount : </b>
                        {eventbooking.totalAmount} LKR
                      </p>

                      {eventbooking.eventbookingStatus == "Pending" ? (
                        <div className="d-flex align-items-center">
                          <p style={{ color: "#ffc107" }}>
                            <b>Eventbooking Status : </b>
                            {eventbooking.eventbookingStatus}
                          </p>
                          <Popconfirm
                            title="Delete the task"
                            description="Are you sure to delete this Event?"
                            onConfirm={() => {
                              deleteHandler(eventbooking._id);
                            }}
                            onCancel={() => {}}
                            okText="Yes"
                            cancelText="No"
                          >
                            <button
                              style={{
                                width: "100px",
                                height: "25px",
                                borderRadius: "5px",
                                backgroundColor: "#ff4d4f",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                                marginLeft: "10px",
                              }}
                            >
                              Cancel Eventbooking
                            </button>
                          </Popconfirm>
                        </div>
                      ) : eventbooking.eventbookingStatus == "Confirmed" ? (
                        <p style={{ color: "green" }}>
                          <b>Eventbooking Status : </b>
                          {eventbooking.eventbookingStatus}
                        </p>
                      ) : (
                        <p style={{ color: "red" }}>
                          <b>Eventbooking Status : </b>
                          {eventbooking.eventbookingStatus}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
          )}
        </Col>
      </Row>
      <Pagination
        style={{
          marginTop: "50px",
        }}
        defaultCurrent={1}
        total={occasionsLength}
        defaultPageSize={4}
        onChange={handlePaginationChange}
      />
    </DefaultLayout>
  );
}

export default UserEventbookings;
