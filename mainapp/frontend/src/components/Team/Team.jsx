import React from "react";
import Slider from "react-slick";
import ava01 from "../../assets/images/ava-1.jpg";
import ava02 from "../../assets/images/ava-2.jpg";
import ava03 from "../../assets/images/ava-3.jpg";

const Team = () => {
  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 1000,
    swipeToSlide: 2000,
    slidesToShow: 4,

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
      <div className="team py-4 px-3">
        <div className="team_Name d-flex align-items-center gap-4 mt-3">
          <img src={ava01} className="w-25 h-25 rounded-2" alt="" />
          <div>
            <h6 className="mb-0 mt-3">A & D Couple</h6>
            <p>Couple</p>
          </div>
        </div>

        <p>
          Managing wedding with Blissify was an absolute dream! They truly
          listened to our vision and brought it to life flawlessly. From venue
          selection to coordinating vendors, every detail was handled with care
          and professionalism.
          {/* Our wedding day was perfect, and we owe so much of
          that to their expertise and dedication." */}
        </p>
      </div>

      <div className="team py-4 px-3">
        <div className="team_Name d-flex align-items-center gap-4 mt-3">
          <img src={ava02} className="w-25 h-25 rounded-2" alt="" />
          <div>
            <h6 className="mb-0 mt-3">4000 Photography</h6>
            <p>Photographer</p>
          </div>
        </div>

        <p>
          As a vendor, I've had the pleasure of working with Blissify on
          multiple occasions, and each time has been fantastic. They have a keen
          eye for detail and a genuine passion for creating memorable
          experiences for their clients.
          {/* Their professionalism and dedication to
          excellence set them apart in the industry. I highly recommend them to
          any couple looking for top-notch wedding planning services." */}
        </p>
      </div>

      <div className="team py-4 px-3">
        <div className="team_Name d-flex align-items-center gap-4 mt-3">
          <img src={ava03} className="w-25 h-25 rounded-2" alt="" />
          <div>
            <h6 className="mb-0 mt-3">Saranga Silva</h6>
            <p>Guest</p>
          </div>
        </div>

        <p>
          Attending A & D Couple's wedding was an absolute delight, and it's
          clear that Blissify played a significant role in making it such a
          magical event. Every detail, from the décor to the timeline, was
          executed flawlessly.
          {/* As a guest, I was able to relax and fully enjoy
          the celebration, knowing that everything was taken care of. It was
          truly a night to remember, thanks to their hard work and expertise." */}
        </p>
      </div>

      <div className="team py-4 px-3">
        <div className="team_Name d-flex align-items-center gap-4 mt-3">
          <img src={ava01} className="w-25 h-25 rounded-2" alt="" />
          <div>
            <h6 className="mb-0 mt-3">Perera Flora</h6>
            <p>Florist</p>
          </div>
        </div>

        <p>
          Creating floral arrangements for the wedding was a joy, thanks to your
          detailed plans and creative vision. Your team's coordination made it
          easy for us to bring the couple's floral dreams to life.
          {/* Thank you
          for the opportunity to be part of such a beautiful celebration." */}
        </p>
      </div>

      <div className="team py-4 px-3">
        <div className="team_Name d-flex align-items-center gap-4 mt-3">
          <img src={ava02} className="w-25 h-25 rounded-2" alt="" />
          <div>
            <h6 className="mb-0 mt-3">Plaza Catering</h6>
            <p>Catering</p>
          </div>
        </div>

        <p>
          From menu selections to dietary restrictions, your wedding planning
          service was on top of every detail when it came to catering. It was a
          pleasure working with a team that prioritizes not only the couple's
          vision
          {/* but also the satisfaction of their guests. Thank you for a
          wonderful experience." */}
        </p>
      </div>

      <div className="team py-4 px-3">
        <div className="team_Name d-flex align-items-center gap-4 mt-3">
          <img src={ava03} className="w-25 h-25 rounded-2" alt="" />
          <div>
            <h6 className="mb-0 mt-3">Limousine LK</h6>
            <p>Transportation Provider</p>
          </div>
        </div>

        <p>
          Your wedding planning service ensured that transportation logistics
          were seamless from start to finish. Clear communication and attention
          to detail made it easy for us to provide transportation services
          {/* for the wedding party and guests. Thank you for making our part in the
          wedding effortless." */}
        </p>
      </div>
    </Slider>
  );
};

export default Team;
