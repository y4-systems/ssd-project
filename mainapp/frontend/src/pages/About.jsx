import React from "react";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import "../styles/about.css";
import Team from "../components/Team/Team";

const About = () => {
  return (
    <>
      {/* About the company and team section start */}
      <section className="AboutUs">
        <Container>
          <Row>
            <Col lg="12">
              <div className="content">
                <h1>About Us</h1>
                <p>
                  "Our Wedding Management System is designed to transform your
                  special day into an unforgettable experience, seamlessly
                  blending technology with timeless romance. With meticulous
                  attention to detail, our platform simplifies every aspect of
                  wedding planning, from guest list management to vendor
                  coordination. We understand that your wedding day is a
                  culmination of dreams and aspirations
                  {/* , which is why our system
                  is crafted to cater to your unique vision. Whether you
                  envision an intimate gathering or a grand celebration, our
                  team is dedicated to bringing your ideas to life, ensuring a
                  smooth and stress-free journey from 'yes' to 'I do.' Trust us
                  to orchestrate the perfect harmony of love, commitment, and
                  celebration on your wedding day." */}
                </p>
              </div>
              <div className="slider">
                <h2>Our Team</h2>
                <Team />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* About the company and team section end */}

      {/* Contact us section start */}
      <section className="ContactUs">
        <Container>
          <Row>
            <h1>
              <i className="ri-edit-2-fill"></i>Let's start a conversation
            </h1>
            <Col lg="6">
              <div className="ContactUs_content">
                <h2>Ask how we can help you ...</h2>
                <p>
                  Curious about how our Wedding Management System can elevate
                  your special day? Ask us how we can help you bring your
                  wedding vision to fruition!
                  <br />
                  Whether you're seeking expert advice on vendor selection,
                  personalized budget planning, or innovative ideas to make your
                  ceremony and reception truly memorable.
                </p>

                <h2>Offline Location</h2>
                <p>
                  Malabe <br />
                  Kaduwela Road,
                  <br /> Kothalawala,
                  <br /> Sri Lanka
                </p>

                <h2>Contact Information</h2>
                <p>Email: blissify@info.com</p>
                <p>Phone: +94 77 123 4567</p>

                <h2>Privacy Information</h2>
                <p>
                  At the heart of our Wedding Management System lies a steadfast
                  commitment to safeguarding your privacy and ensuring the
                  confidentiality of your personal information.
                  {/* We recognize the
                  sensitivity of the data entrusted to us and adhere to
                  stringent privacy protocols to protect it. Rest assured that
                  any information shared with us, whether pertaining to your
                  guest list, venue preferences, or financial details, is
                  handled with the utmost discretion and care. Our platform
                  employs robust security measures to prevent unauthorized
                  access, maintain data integrity, and mitigate potential risks.
                  Your trust is paramount to us, and we are dedicated to
                  upholding the highest standards of privacy and security as we
                  assist you in planning the wedding of your dreams. */}
                </p>
              </div>
            </Col>
            {/* Contact us section end */}

            {/* Contact form start */}
            <Col lg="6">
              <div className="ContactUs_form">
                <Form className="ContactUs_Info">
                  <FormGroup>
                    <input
                      type="text"
                      placeholder="Fist Name"
                      id="firstName"
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <input
                      type="text"
                      placeholder="Last Name"
                      id="lastName"
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <input
                      type="email"
                      placeholder="Email"
                      id="email"
                      required
                    />
                  </FormGroup>
                  <FormGroup className="message">
                    <input
                      type="message"
                      placeholder="Any question? Notes?"
                      id="message"
                      required
                    />
                  </FormGroup>
                  <FormGroup className="country">
                    <select className="countryList">
                      <option value="Country">Country</option>
                    </select>
                  </FormGroup>
                  <Button className="btn primary__btn w-100 mb-1 mt-4">
                    Send
                  </Button>
                </Form>
              </div>
            </Col>

            {/* Contact form end */}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default About;
