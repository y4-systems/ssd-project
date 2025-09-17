import React from "react";
import Slider from "react-slick";
import ava01 from "../../assets/images/ava-1.jpg";
import ava02 from "../../assets/images/ava-2.jpg";
import ava03 from "../../assets/images/ava-3.jpg";

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    swipeToSlide: 2000,
    slidesToShow: 3,

    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          SlidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesTOShow: 1,
          SlidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      <div className="testimonial py-4 px-3">
        <p>
          Managing wedding with Blissify was an absolute dream! They truly
          listened to our vision and brought it to life flawlessly. From venue
          selection to coordinating vendors, every detail was handled with care.
        </p>

        <div className="d-flex align-items-center gap-4 mt-3">
          <img src={ava01} className="w-25 h-25 rounded-2" alt="" />
          <div>
            <h6 className="mb-0 mt-3">Nimal Silva</h6>
            <p>Couple</p>
          </div>
        </div>
      </div>
      <div className="testimonial py-4 px-3">
        <p>
          Creating floral arrangements for the wedding was a joy, thanks to your
          detailed plans and creative vision. Your team's coordination made it
          easy for us to bring the couple's floral dreams to life.
        </p>

        <div className="d-flex align-items-center gap-4 mt-3">
          <img src={ava02} className="w-25 h-25 rounded-2" alt="" />
          <div>
            <h6 className="mb-0 mt-3">Semini Abimanthra</h6>
            <p>Florist</p>
          </div>
        </div>
      </div>
      <div className="testimonial py-4 px-3">
        <p>
          From menu selections to dietary restrictions, your wedding planning
          service was on top of every detail when it came to catering. It was a
          pleasure working with a team that prioritizes not only the couple's
          vision
        </p>

        <div className="d-flex align-items-center gap-4 mt-3">
          <img src={ava03} className="w-25 h-25 rounded-2" alt="" />
          <div>
            <h6 className="mb-0 mt-3">Sanuth Pasan</h6>
            <p>Catering</p>
          </div>
        </div>
      </div>
      <div className="testimonial py-4 px-3">
        <p>
          As a vendor, I've had the pleasure of working with Blissify on
          multiple occasions, and each time has been fantastic. They have a keen
          eye for detail and a genuine passion for creating memorable
          experiences for clients.
        </p>

        <div className="d-flex align-items-center gap-4 mt-3">
          <img src={ava02} className="w-25 h-25 rounded-2" alt="" />
          <div>
            <h6 className="mb-0 mt-3">Semini Abimanthra</h6>
            <p>Photographer</p>
          </div>
        </div>
      </div>
      <div className="testimonial py-4 px-3">
        <p>
          Attending A & D Couple's wedding was an absolute delight, and it's
          clear that Blissify played a significant role in making it such a
          magical event. Every detail, from the décor to the timeline, was
          executed flawlessly.
        </p>

        <div className="d-flex align-items-center gap-4 mt-3">
          <img src={ava03} className="w-25 h-25 rounded-2" alt="" />
          <div>
            <h6 className="mb-0 mt-3">Sanuth pasan</h6>
            <p>Guest</p>
          </div>
        </div>
      </div>
    </Slider>
  );
};

export default Testimonials;
