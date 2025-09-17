import React from "react";
import "./newsletter.css";

import { Container, Row, Col } from "reactstrap";
import bride from "../assets/images/bride.jpg";
import couple from "../assets/images/couple11.jpg";
import couple2 from "../assets/images/couple22.jpg";

const Newsletter = () => {
  return (
    <section className="newsletter">
      <Container>
        <Row>
          <Col lg="6">
            <div className="newsletter_content">
              <h2>Subscribe now to get useful wedding information</h2>

              <div className="newsletter_input">
                <input type="email" placeholder="Enter your email" />
                <button className="btn newsletter_btn">Subcribe</button>
              </div>
              <p>
                Stay in the loop with the latest wedding trends, expert tips,
                and exclusive offers by subscribing to our newsletter
              </p>
            </div>
          </Col>
          <Col lg="6">
            <div className="newsletter_images">
              <div className="newsletter_img">
                <img src={couple} alt="" style={{ width: "30%" }} />
                <img src={bride} alt="" style={{ width: "30%" }} />
                <img src={couple2} alt="" style={{ width: "30%" }} />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Newsletter;
