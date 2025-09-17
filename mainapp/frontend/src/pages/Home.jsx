import React from "react";
import "../styles/home.css";

import { Container, Row, Col } from "reactstrap";

import heroVideo from "../assets/images/heroweddingvideo.mp4";
import experienceImg from "../assets/images/circle.jpg";

import SearchBar from "../shared/SearchBar";
import ServiceList from "../services/ServiceList";
import FeaturedTourList from "../components/Featured-tours/FeaturedTourList";
import MasonryImagesGallery from "../components/image-gallery/MasonryImagesGallery";
import Testimonials from "../components/Testimonial/Testimonials";
import Newsletter from "../shared/Newsletter";

const heroImg02 =
  "https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const heroImg =
  "https://images.pexels.com/photos/157757/wedding-dresses-fashion-character-bride-157757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const Home = () => {
  return (
    <>
      {/* hero section start  */}
      <section className="hero">
        <Container>
          <Row>
            <Col lg="6">
              <div className="hero_Content">
                <h1>
                  Welcome <br /> to Blissify
                </h1>
                <p>
                  We are the best wedding planning service in Sri Lanka which
                  has all services in one single place. <br></br>
                  Experience the beaty of the wedding with us. We are here to
                  help you to make your dream day to a reality.
                </p>
              </div>
            </Col>

            <Col lg="2">
              <div className="hero_img-box">
                <img src={heroImg} alt="" />
              </div>
            </Col>
            <Col lg="2">
              <div className="hero_img-box hero_video-box mt-4">
                <video src={heroVideo} autoPlay loop muted />
              </div>
            </Col>
            <Col lg="2">
              <div className="hero_img-box mt-5">
                <img src={heroImg02} alt="" />
              </div>
            </Col>

            <SearchBar />
          </Row>
        </Container>
      </section>
      {/* hero section end */}

      <section>
        <Container>
          <Row>
            <Col lg="3">
              <h5 className="subtitle">What we serve</h5>
              <h2 className="service_title">We offer our best services</h2>
            </Col>
            <ServiceList />
          </Row>
        </Container>
      </section>

      {/* Featured tours start */}
      {/* <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5">
              <h5 className="subtitle">Explore</h5>
              <h2 className="featured_tour-title">
                Our featured Wedding Events
              </h2>
            </Col>
            <FeaturedTourList />
          </Row>
        </Container>
      </section> */}

      {/* Featured tours start */}

      {/* Experience section start */}

      <section>
        <Container>
          <Row>
            <Col lg="6">
              <div className="experience_content">
                <h5 className="subtitle">Exprience</h5>
                <h2>
                  With our all experience
                  <br /> we will serve you
                </h2>
                <p>
                  Discover the Jewel of the wedding with our extreme Service!,
                  <br />
                  We are happy to provide you with the one and only best wedding
                  management service in Sri Lanka.
                </p>
              </div>

              <div className="counter_wrapper d-flex align-items-center gap-5">
                <div className="counter_box">
                  <span>12K+</span>
                  <h6>Successful Events</h6>
                </div>
                <div className="counter_box">
                  <span>2K+</span>
                  <h6>Regular Clients</h6>
                </div>
                <div className="counter_box">
                  <span>15+</span>
                  <h6>Years Experience</h6>
                </div>
              </div>
            </Col>
            <Col lg="6">
              <div className="experience_img">
                <img
                  src={experienceImg}
                  style={{
                    borderRadius: "50%",
                    height: "500px",
                    marginLeft: "100px",
                  }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Experience section end */}

      {/* Gallery section start */}
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <h5 className="subtitle">Gallery</h5>
              <h2 className="gallery_title">Visit Our Wedding Albums</h2>
            </Col>
            <Col lg="12">
              <MasonryImagesGallery />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Gallery section start */}

      {/* Testimonial section start */}

      <section>
        <Container>
          <Col lg="12">
            <h5 className="subtitle">Clients Love</h5>
            <h2 className="testimonial_title">What our clients say about us</h2>
          </Col>
          <Col lg="12">
            <Testimonials />
          </Col>
        </Container>
      </section>

      {/* Testimonial section end */}
      <Newsletter />
    </>
  );
};

export default Home;
