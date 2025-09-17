import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { Col, Row, Form, Input, message, Select, Space } from "antd";
import Spinner from "../components/Spinner";
import { useParams } from "react-router-dom";
import axios from "axios";

function EditOccasion({ match }) {
  const { occasionid } = useParams();

  //Get existing occasion details
  const [name, setName] = useState("");
  const [rentPerHour, setRentPerHour] = useState("");
  const [capacity, setCapacity] = useState("");
  const [location, setlocation] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [image, setImage] = useState("");
  const [occasion, setOccasion] = useState({});
  const [category, setCategory] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getOccasion();
  }, []);

  function getOccasion() {
    setIsLoading(true);
    let mounted = true;
    axios
      .get(`/api/occasions/getoneoccasion/${occasionid}`)
      .then((res) => {
        if (mounted) {
          setName(res.data.occasion.name);
          setRentPerHour(res.data.occasion.rentPerHour);
          setCapacity(res.data.occasion.capacity);
          setlocation(res.data.occasion.location);
          setImage(res.data.occasion.image);
          setCategory(res.data.occasion.category);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
    return () => (mounted = false);
  }

  const handleChange = (value) => {
    setCategory(value);
  };

  const onUpdate = async () => {
    //Submit handler
    setIsLoading(true);
    console.log(imageFile);
    const data = {
      _id: occasionid,
      name,
      rentPerHour,
      capacity,
      location,
      category,
      image,
    };
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "jkwkiav1");
      formData.append("folder", "occasion_images");

      await fetch("https://api.cloudinary.com/v1_1/dljyf8xev/image/upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((res) => {
          data.image = res.secure_url;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      data.image = image;
    }

    await axios
      .patch(`/api/occasions/editoccasion`, data)
      .then((res) => {
        //success message
        message.success("Occasion details Updated Succesfully");
        setTimeout(() => {
          window.location.href = "/admin";
        }, 500);
      })
      .catch((err) => {
        console.log(err);
        isLoading(false);
      });
  };

  return (
    <DefaultLayout>
      {isLoading && <Spinner />}
      <Row justify="center" className="mt-5">
        <Col lg={16} sm={24}>
          <Form
            onFinish={onUpdate}
            style={{
              display: "flex",
              borderRadius: "5px",
            }}
            initialValues={occasion}
            className="bs1 p-2"
            layout="vertical"
          >
            <div
              style={{
                flex: 1,
                padding: "35px",
              }}
            >
              <h3>Edit Event</h3>

              <Form.Item label="Occasion name" rules={[{ required: true }]}>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </Form.Item>
              <Form.Item label="Event Image">
                <Input
                  type="file"
                  onChange={(e) => {
                    setImageFile(e.target.files[0]);
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Estimated Budget (LKR)"
                type="number"
                rules={[{ required: true }]}
              >
                <Input
                  value={rentPerHour}
                  onChange={(e) => setRentPerHour(e.target.value)}
                />
              </Form.Item>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Form.Item
                  label="Capacity"
                  type="number"
                  rules={[{ required: true }]}
                >
                  <Input
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Location" rules={[{ required: true }]}>
                  <Input
                    value={location}
                    onChange={(e) => {
                      setlocation(e.target.value);
                    }}
                  />
                </Form.Item>
              </div>

              <Form.Item name="Category" label="Category">
                <Space>
                  <Select
                    defaultValue="--Select--"
                    style={{ width: 480 }}
                    onChange={handleChange}
                    value={category}
                    options={[
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
              </Form.Item>

              <div>
                <button
                  className="btn1"
                  style={{
                    borderRadius: "10px",
                    width: "50%",
                    height: "40px",
                  }}
                >
                  Edit Occasion
                </button>
              </div>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src="https://images.pexels.com/photos/1560303/pexels-photo-1560303.jpeg?auto=compress&cs=tinysrgb&w=600"
                style={{ width: "400px", height: "600px" }}
              />
            </div>
          </Form>
        </Col>
      </Row>
    </DefaultLayout>
  );
}

export default EditOccasion;
