import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useSelector, useDispatch } from "react-redux";
import { getAllOccasions } from "../redux/actions/occasionsAction";
import {
  Row,
  Col,
  DatePicker,
  Space,
  Select,
  Input,
  Card,
  Pagination,
} from "antd";
import { AudioOutlined } from "@ant-design/icons";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import Meta from "antd/es/card/Meta";
import moment from "moment";
const { RangePicker } = DatePicker;

function Home() {
  const { occasions } = useSelector((state) => state.occasionReducer);
  const { loading } = useSelector((state) => state.alertsReducer);
  const [totalOccasions, setTotaloccasions] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOccasions());
  }, []);

  useEffect(() => {
    setTotaloccasions(occasions);
  }, [occasions]);

  function setFilter(values) {
    var selectedOccasions = [];

    selectedOccasions = occasions;

    for (var occasion of occasions) {
      if (occasion.bookedTimeSlots.length == 0) {
        //check if the occasion is already in the array
        if (!selectedOccasions.includes(occasion)) {
          selectedOccasions = selectedOccasions.filter(
            (item) => item !== occasion
          );
        }
      } else {
        for (var eventbooking of occasion.bookedTimeSlots) {
          if (
            moment(values[0].$d, "MMM DD YYYY HH:mm").isBetween(
              eventbooking.from,
              eventbooking.to
            ) ||
            moment(values[1].$d, "MMM DD YYYY HH:mm").isBetween(
              eventbooking.from,
              eventbooking.to
            ) ||
            moment(eventbooking.from).isBetween(
              moment(values[0].$d, "MMM DD YYYY HH:mm"),
              moment(values[1].$d, "MMM DD YYYY HH:mm")
            ) ||
            moment(eventbooking.to).isBetween(
              moment(values[0].$d, "MMM DD YYYY HH:mm"),
              moment(values[1].$d, "MMM DD YYYY HH:mm")
            )
          ) {
            selectedOccasions = selectedOccasions.filter(
              (item) => item !== occasion
            );
          }
        }
      }
    }
    // console.log("selectedOccasions", selectedOccasions);
    setTotaloccasions(selectedOccasions);
  }

  //catergory sort
  const handleChange = (value) => {
    if (value == "All") {
      setTotaloccasions(occasions);
    } else {
      var temp = [];
      for (var occasion of occasions) {
        if (occasion.category == value) {
          temp.push(occasion);
        }
      }
      setTotaloccasions(temp);
    }
  };

  //Get the array length of the occasions
  const occasionsLength = totalOccasions.length;

  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: "#1890ff",
      }}
    />
  );
  const { Search } = Input;
  const [page, setPage] = useState(1);

  //Pagination
  const handlePaginationChange = (value) => {
    if (value == 1) {
      setPage(1);
    } else {
      setPage(value);
    }
  };

  //get search value
  const onSearch = async (value) => {
    var searchKey = value.target.value;
    setTotaloccasions(occasions);
    filterData(totalOccasions, searchKey.toLowerCase());
  };

  //Occasion search function
  const filterData = (totalOccasions, searchKey) => {
    const result = occasions.filter((occasion) =>
      occasion.name.toLowerCase().includes(searchKey)
    );
    setTotaloccasions(result);
  };

  return (
    <DefaultLayout>
      <Row className="mt-5" justify={"center"}>
        <Col
          lg={20}
          sm={20}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "50px",
            alignItems: "center",
          }}
        >
          <Space direction="vertical">
            <Search placeholder="Search" onChange={onSearch} enterButton />
          </Space>
          <Space>
            <Select
              defaultValue="Filter By Category"
              style={{ width: 200 }}
              onChange={handleChange}
              options={[
                { value: "All", label: "All" },
                { value: "Engagement", label: "Engagement" },
                {
                  value: "Bachelor/Bachelorette Party",
                  label: "Bachelor/Bachelorette Party",
                },
                {
                  value: "Main Wedding Ceremony",
                  label: "Main Wedding Ceremony",
                },
                {
                  value: "Home Comming Ceremony",
                  label: "Home Comming Ceremony",
                },
                { value: "Other", label: "Other" },
              ]}
            />
          </Space>
          <RangePicker
            showTime={{ format: "HH:mm" }}
            format="MMM DD YYYY HH:mm"
            onChange={setFilter}
          />
        </Col>
      </Row>

      {loading === true && <Spinner />}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: "50px",
        }}
      >
        {totalOccasions.slice((page - 1) * 4, page * 4).map((occasion) => {
          return (
            <div>
              <Card
                style={{
                  width: 300,
                  boxShadow:
                    "box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;",
                }}
                cover={
                  <img
                    alt="example"
                    src={occasion.image}
                    style={{
                      objectFit: "cover",
                      height: "200px",
                      width: "100%",
                    }}
                  />
                }
                actions={[
                  <button
                    style={{
                      backgroundColor: "#4d1c9c",
                      width: "50%",
                      color: "white",
                      borderRadius: "10px",
                      padding: "5px",
                      border: "none",
                      marginBottom: "10px",
                    }}
                  >
                    <Link
                      to={`/bookoccasion/${occasion._id}`}
                      style={{
                        color: "white",
                      }}
                    >
                      Explore
                    </Link>
                  </button>,
                ]}
              >
                <Meta
                  title={occasion.name}
                  description={
                    <div>
                      <p>Estimated Budget: {occasion.rentPerHour} LKR </p>

                      <p>Category: {occasion.category} </p>
                    </div>
                  }
                />
              </Card>
            </div>
          );
        })}
      </div>
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

export default Home;
