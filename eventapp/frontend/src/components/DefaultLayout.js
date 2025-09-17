import React from "react";
import { Menu, Button, Dropdown, Space, Row, Col } from "antd";
import { Link } from "react-router-dom";
import { Footer } from "antd/es/layout/layout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function DefaultLayout(props) {
  const user = JSON.parse(localStorage.getItem("user"));
  const items = [
    {
      key: "1",
      label: <a href="/">Home</a>,
    },
    {
      key: "2",
      label: <a href="/usereventbookings">My Eventbookings</a>,
    },
    {
      key: "4",
      label: (
        <li
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          Logout
        </li>
      ),
    },
  ];

  const adminItems = [
    {
      key: "1",
      label: <a href="/">Home</a>,
    },
    {
      key: "2",
      label: <a href="/alleventbookings">All Eventbookings</a>,
    },
    {
      key: "3",
      label: (
        <li
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          Logout
        </li>
      ),
    },
  ];

  return (
    <div
      style={{
        overflowX: "hidden",
      }}
    >
      <div className="header bs2">
        <Row gutter={16} justify="center">
          <Col lg={20} sm={24} xs={24}>
            <div className="d-flex justify-content-between">
              <h1>
                <b>
                  <Link
                    to="/"
                    style={{
                      color: "white",
                      letterSpacing: "1.5px",
                      fontSize: "30px",
                      fontFamily: "serif",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      marginTop: "5px",
                    }}
                  >
                    {/* <img
                      
                      src="https://res.cloudinary.com/dljyf8xev/image/upload/v1684145794/car_images/LK_jdvkpp.png"
                      alt="logo"
                      style={{
                        width: "100px",
                        height: "100%",
                        marginRight: "10px",
                      }}
                    /> */}
                    Blissify
                  </Link>
                </b>
              </h1>

              <Dropdown
                menu={{
                  items: user.role == "Admin" ? adminItems : items,
                }}
                placement="bottom"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "white",
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                >
                  <AccountCircleIcon />
                  {/* <img
                    src="https://res.cloudinary.com/desnqqj6a/image/upload/v1683887268/User-Profile-PNG-High-Quality-Image_mwetdc.png"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  /> */}
                  {user.username}
                </div>
              </Dropdown>
            </div>
          </Col>
        </Row>
      </div>
      <div className="content">{props.children}</div>
      <Footer
        style={{
          textAlign: "center",
          backgroundColor: "#4d1c9c",
          color: "white",
        }}
      >
        Blissify ©2024 Created by {"Blissify Development Team"}
        <span
          style={{
            color: "#4d1c9c",
            letterSpacing: "1.5px",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          {/* MyProduct */}
        </span>
      </Footer>
    </div>
  );
}

export default DefaultLayout;
