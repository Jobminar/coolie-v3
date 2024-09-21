import React, { useContext, useEffect, useState } from "react";
import "./maincategory.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { CategoryContext } from "../../context/CategoryContext";
import coverdyou1 from "../../assets/images/covered-you-1.png";
import coverdyou2 from "../../assets/images/covered-you-2.png";
import coverdyou3 from "../../assets/images/covered-you-3.png";
import coverdyou4 from "../../assets/images/covered-you-4.png";
import coverdyou5 from "../../assets/images/covered-you-5.png";
import coverdyou6 from "../../assets/images/covered-you-6.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const Maincategory = () => {
  const navigate = useNavigate();
  const { categoryData, locationCat, setSelectedCategoryId } =
    useContext(CategoryContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (categoryData) {
      setData(categoryData);
    }
  }, [categoryData]);

  // Handle navigation to "/services"
  const handleCategory = (id) => {
    const isCategoryInLocation = locationCat?.some(
      (locCat) => locCat._id === id,
    );
    if (isCategoryInLocation) {
      setSelectedCategoryId(id);
      navigate("/services");
    } else {
      // Alert if category is not available in user's location
      toast.error(
        "We are currently not serving in your place,we are coming soon!",
      );
    }
  };

  // Custom arrows for the slider
  const NextArrow = (props) => {
    const { className, onClick } = props;
    return (
      <div className={`${className} custom-arrow next-arrow`} onClick={onClick}>
        <FontAwesomeIcon icon={faChevronRight} />
      </div>
    );
  };

  const PrevArrow = (props) => {
    const { className, onClick } = props;
    return (
      <div className={`${className} custom-arrow prev-arrow`} onClick={onClick}>
        <FontAwesomeIcon icon={faChevronLeft} />
      </div>
    );
  };

  // Slider settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 2000, settings: { slidesToShow: 4, slidesToScroll: 1 } },
      { breakpoint: 1750, settings: { slidesToShow: 3.5, slidesToScroll: 1 } },
      { breakpoint: 1500, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 1300, settings: { slidesToShow: 2.8, slidesToScroll: 1 } },
      { breakpoint: 1200, settings: { slidesToShow: 2.5, slidesToScroll: 1 } },
      { breakpoint: 1024, settings: { slidesToShow: 2.2, slidesToScroll: 1 } },
      { breakpoint: 900, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 850, settings: { slidesToShow: 1.5, slidesToScroll: 1 } },
      { breakpoint: 700, settings: { slidesToShow: 1.5, slidesToScroll: 1 } },
      { breakpoint: 630, settings: { slidesToShow: 1.2, slidesToScroll: 1 } },
      { breakpoint: 530, settings: { slidesToShow: 1, slidesToScroll: 1 } },
      { breakpoint: 400, settings: { slidesToShow: 1, slidesToScroll: 1 } },
      { breakpoint: 360, settings: { slidesToShow: 0.9, slidesToScroll: 1 } },
    ],
  };

  return (
    <>
      {/* Main Category Section */}
      <div className="main-category-con">
        {data &&
          data.map((item) => (
            <div
              key={item._id}
              className="sub-cat-con"
              onClick={() => handleCategory(item._id)}
            >
              <div className="main-cat-img">
                <img src={item.imageKey} alt={item.name} />
              </div>
              <p>{item.name}</p>
            </div>
          ))}
      </div>

      {/* Slider Section */}
      <div className="coveredyou-con">
        <Slider {...settings}>
          <div className="covered-you-sub-flow first-sub">
            <div className="coveredyou-content">
              <h1>
                Relax & rejuvenate
                <br />
                at home
              </h1>
              <p>Massage for men</p>
              <button
                onClick={() => navigate("/services")}
                className="covered-book-button"
              >
                Book now
              </button>
            </div>
            <div className="subflow-image">
              <img src={coverdyou1} alt="covered you" />
            </div>
          </div>

          <div className="covered-you-sub-flow second-sub">
            <div className="coveredyou-content">
              <h1>
                Expert haircut
                <br />
                starting at 199
              </h1>
              <p>Haircut at home</p>
              <button className="covered-book-button">Book now</button>
            </div>
            <div className="subflow-image">
              <img src={coverdyou2} alt="covered you" />
            </div>
          </div>

          <div className="covered-you-sub-flow third-sub">
            <div className="coveredyou-content">
              <h1>
                Get Experts
                <br />
                in 2 hours
              </h1>
              <p>Electricians, Plumbers & more</p>
              <button className="covered-book-button">Book now</button>
            </div>
            <div className="subflow-image">
              <img src={coverdyou3} alt="covered you" />
            </div>
          </div>

          <div className="covered-you-sub-flow fourth-sub">
            <div className="coveredyou-content">
              <h1>
                Bridal makeup
                <br />
                at your convenience
              </h1>
              <p>Bridal makeup services</p>
              <button className="covered-book-button">Book now</button>
            </div>
            <div className="subflow-image">
              <img src={coverdyou4} alt="covered you" />
            </div>
          </div>

          <div className="covered-you-sub-flow fifth-sub">
            <div className="coveredyou-content">
              <h1>
                Maintain your kitchen
                <br />
                with ease
              </h1>
              <p>Kitchen maintenance services</p>
              <button className="covered-book-button">Book now</button>
            </div>
            <div className="subflow-image">
              <img src={coverdyou5} alt="covered you" />
            </div>
          </div>

          <div className="covered-you-sub-flow sixth-sub">
            <div className="coveredyou-content">
              <h1>
                Beautiful gardens
                <br />
                all year round
              </h1>
              <p>Gardening services</p>
              <button className="covered-book-button">Book now</button>
            </div>
            <div className="subflow-image">
              <img src={coverdyou6} alt="covered you" />
            </div>
          </div>
        </Slider>
      </div>
    </>
  );
};

export default Maincategory;
