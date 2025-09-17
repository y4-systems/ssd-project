import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteOccasion,
  getAllOccasions,
} from "../redux/actions/occasionsAction";
import Moment from "react-moment";
import {
  Row,
  Col,
  DatePicker,
  Avatar,
  Card,
  Input,
  Space,
  Popconfirm,
  Pagination,
} from "antd";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import {
  DeleteFilled,
  EditOutlined,
  FileExcelOutlined,
  // PlusCircleOutlined,
} from "@ant-design/icons";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";

const { Meta } = Card;

const { RangePicker } = DatePicker;

function AdminHome() {
  const { occasions } = useSelector((state) => state.occasionReducer);
  const { loading } = useSelector((state) => state.alertsReducer);
  const [totalOccasions, setTotaloccasions] = useState([]);
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getAllOccasions());
  }, []);

  useEffect(() => {
    setTotaloccasions(occasions);
  }, [occasions]);

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const { Search } = Input;

  const onSearch = async (value) => {
    var searchKey = value.target.value;
    setTotaloccasions(occasions);
    filterData(totalOccasions, searchKey.toLowerCase());
  };

  //Occasion search function
  const filterData = (totalOccasions, searchKey) => {
    const result = occasions.filter(
      (occasion) =>
        occasion.name.toLowerCase().includes(searchKey) ||
        occasion.category.toLowerCase().includes(searchKey)
    );
    setTotaloccasions(result);
  };

  //Get the array length of the occasions
  const occasionsLength = totalOccasions.length;

  //Pagination
  const handlePaginationChange = (value) => {
    if (value == 1) {
      setPage(1);
    } else {
      setPage(value);
    }
  };

  //Generate Excel Report
  const exportToExcel = async () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    var tempOccasions = totalOccasions;

    //remove unwanted fields
    tempOccasions.map((occasion) => {
      delete occasion._id;
      delete occasion.__v;
      delete occasion.image;
      delete occasion.bookedTimeSlots;
    });

    const ws = XLSX.utils.json_to_sheet(tempOccasions);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "Occasion Report " + Date.now() + fileExtension);
  };

  return (
    <DefaultLayout
      style={{
        padding: "20px",
      }}
    >
      <Row justify={"center"} gutter={16} className="mt-5">
        <Col lg={20} sm={24}>
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
            <button
              style={{
                backgroundColor: "#4d1c9c",
                color: "white",
                borderRadius: "10px",
                padding: "10px",
                border: "none",
                marginBottom: "10px",
                padding: "10px 20px",
              }}
            >
              <Link to="/addoccasion">
                <div
                  style={{
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  {/* <PlusCircleOutlined /> */}
                  Add New Event
                </div>
              </Link>
            </button>
          </div>
        </Col>
      </Row>

      {loading == true && <Spinner />}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        {totalOccasions.slice((page - 1) * 4, page * 4).map((occasion) => {
          return (
            // <Title>h1. Ant Design</Title>
            <div>
              <Card
                style={{
                  width: 300,
                  borderColor: "#4d1c9c",
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
                  <Link to={`/editoccasion/${occasion._id}`}>
                    <EditOutlined
                      key="edit"
                      style={{
                        color: "green",
                      }}
                    />
                  </Link>,

                  <Popconfirm
                    title="Delete the task"
                    description="Are you sure to delete this Event?"
                    onConfirm={() => {
                      dispatch(deleteOccasion({ occasionid: occasion._id }));
                    }}
                    onCancel={() => {}}
                    okText="Yes"
                    cancelText="No"
                  >
                    <DeleteFilled
                      key="delete"
                      style={{
                        color: "red",
                      }}
                    />
                    ,
                  </Popconfirm>,
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

export default AdminHome;
