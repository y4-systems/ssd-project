import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { Space, Table, Tag, Input, message } from "antd";
import axios from "axios";
import {
  CheckOutlined,
  CloseOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
import moment from "moment";

const AllEventbookings = () => {
  //Pagination
  const [page, setPage] = useState(1);
  const [eventbookingLength, setEventbookingLength] = useState(0);
  const [totalBokings, setTotalBokings] = useState([]);
  const [tempData, setTempData] = useState([]); //table data [array

  //Pagination
  const handlePaginationChange = (value) => {
    if (value == 1) {
      setPage(1);
    } else {
      setPage(value);
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={image}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      ),
    },
    {
      title: "Event Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },

    {
      title: "Purchased Couple",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Rental Time",
      key: "tags",
      dataIndex: "tags",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color =
              tag.length > 5
                ? "geekblue"
                : tag.length == 5
                ? "green"
                : tag.length == 3
                ? "volcano"
                : "purple";

            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Status",
      dataIndex: "eventbookingStatus",
      key: "eventbookingStatus",
      render: (eventbookingStatus, key) => (
        <>
          {eventbookingStatus == "Pending" ? (
            // approve & decline buttons
            <div className="d-flex">
              <button
                onClick={() => {
                  axios
                    .patch(`/api/eventbookings/confirmEventbooking/${key.key}`)
                    .then((res) => {
                      message.success("Eventbooking Confirmed");
                      window.location.reload();
                    });
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  border: "1px solid green",
                  color: "green",
                  backgroundColor: "white",
                }}
              >
                <CheckOutlined />
              </button>
              <button
                onClick={() => {
                  axios
                    .patch(`/api/eventbookings/declineEventbooking/${key.key}`)
                    .then((res) => {
                      message.success("Eventbooking Declined");
                      window.location.reload();
                    });
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  border: "1px solid red",
                  color: "red",
                  marginLeft: "10px",
                  backgroundColor: "white",
                }}
              >
                <CloseOutlined />
              </button>
            </div>
          ) : eventbookingStatus == "Confirmed" ? (
            <Tag color="green">{eventbookingStatus.toUpperCase()}</Tag>
          ) : (
            <Tag color="volcano">{eventbookingStatus.toUpperCase()}</Tag>
          )}
        </>
      ),
    },
  ];
  const [data, setData] = React.useState([]); //table data [array
  //Get all eventbookings
  const getAllEventbookings = () => {
    axios.get(`/api/eventbookings/getalleventbookings`).then((res) => {
      setTotalBokings(res.data.eventbookings);
      var temp = [];
      //Push data to data array using for loop
      for (let i = 0; i < res.data.eventbookings.length; i++) {
        temp.push({
          key: res.data.eventbookings[i]._id,
          name: res.data.eventbookings[i].occasion.name,
          category: res.data.eventbookings[i].occasion.category,
          username: res.data.eventbookings[i].user.username,
          eventbookingStatus: res.data.eventbookings[i].eventbookingStatus,
          tags: [
            "FROM:",
            moment(res.data.eventbookings[i].bookedTimeSlots.from).format(
              "DD-MM-YYYY hh:mm A"
            ),
            "TO:",
            moment(res.data.eventbookings[i].bookedTimeSlots.to).format(
              "DD-MM-YYYY hh:mm A"
            ),
          ],
          image: res.data.eventbookings[i].occasion.image,
          amount: res.data.eventbookings[i].totalAmount + " LKR",
        });
      }
      setData(temp);
      setTempData(temp);
      setEventbookingLength(res.data.eventbookings.length);
    });
  };

  useEffect(() => {
    getAllEventbookings();
  }, []);

  //Occasion search function
  const { Search } = Input;
  const onSearch = async (value) => {
    var searchKey = value.target.value;

    filterData(tempData, searchKey.toLowerCase());
  };

  const filterData = (eventbookings, searchKey) => {
    const result = eventbookings.filter((eventbooking) =>
      eventbooking.name.toLowerCase().includes(searchKey)
    );
    setData(result);
    setEventbookingLength(result.length);
  };

  console.log("data", data);

  //Generate Excel Report
  const exportToExcel = async () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    totalBokings.map((eventbooking) => {
      eventbooking["User"] = eventbooking.user.username;
      eventbooking["Event Name"] = eventbooking.occasion.name;
      eventbooking["Event Category"] = eventbooking.occasion.category;
      eventbooking["From"] = eventbooking.bookedTimeSlots.from;
      eventbooking["To"] = eventbooking.bookedTimeSlots.to;
      eventbooking["Total Amount"] = eventbooking.totalAmount;
      eventbooking["Total hours"] = eventbooking.totalHours;
      eventbooking["Drive Status"] = eventbooking.driverRequired ? "Yes" : "No";
      eventbooking["Created At"] = eventbooking.createdAt;

      delete eventbooking._id;
      delete eventbooking.__v;
      delete eventbooking.bookedTimeSlots;
      delete eventbooking.user;
      delete eventbooking.occasion;
      delete eventbooking.createdAt;
      delete eventbooking.updatedAt;
      delete eventbooking.driverRequired;
      delete eventbooking.totalAmount;
      delete eventbooking.totalHours;
      delete eventbooking.transactionId;
    });
    const ws = XLSX.utils.json_to_sheet(totalBokings);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "Eventbooking Report" + Date.now() + fileExtension);
  };

  return (
    <DefaultLayout>
      <div
        style={{
          padding: "50px",
        }}
      >
        <span
          className="text-center"
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            color: "darkslategray",
          }}
        >
          All Eventbookings
        </span>

        <div
          className="text-end"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              justifyContent: "flex-end",
              cursor: "pointer",
            }}
            onClick={exportToExcel}
          >
            <div>
              <FileExcelOutlined
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </div>
            <div>Download Report</div>
          </div>

          <Space
            direction="vertical"
            style={{
              width: "500px",
            }}
          >
            <Search placeholder="Search" onChange={onSearch} enterButton />
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={data.slice((page - 1) * 4, page * 4)}
          style={{
            marginTop: "20px",
          }}
          pagination={{
            onChange: handlePaginationChange,
            defaultPageSize: 4,
            showSizeChanger: false,
            total: eventbookingLength,
            defaultCurrent: 1,

            position: ["bottomCenter"],
          }}
        />
      </div>
    </DefaultLayout>
  );
};

export default AllEventbookings;
