import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "./our-core-services.css"; // Import your styling
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const OurCoreServices = () => {
  const navigate = useNavigate();
  const [coreServices, setCoreServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api-tasktigers.azurewebsites.net/v1.0/admin/our-core-services",
        );
        const data = await response.json();
        setCoreServices(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const repeatItems = (items, totalSlides) => {
    let repeatedItems = [];
    while (repeatedItems.length < totalSlides) {
      repeatedItems = repeatedItems.concat(items);
    }
    return repeatedItems.slice(0, totalSlides);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Define how many slides you want to show
  const slidesToShow = 5.5;

  // Repeat items if there are not enough to fill the carousel
  const displayedServices = repeatItems(coreServices, slidesToShow);

  const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} custom-next-arrow`}
        style={{ ...style }}
        onClick={onClick}
      >
        <span>&#10095;</span>
      </div>
    );
  };

  const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} custom-prev-arrow`}
        style={{ ...style }}
        onClick={onClick}
      >
        <span>&#10094;</span>
      </div>
    );
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="core-services-container">
      <h2>
        Our Core <span>Services</span>
      </h2>
      <Slider {...settings} className="core-services-slider">
        {displayedServices.map((service, index) => (
          <div key={index} className="service-item">
            <div className="service-image-container">
              <img
                src={service.image}
                onClick={() => navigate("/services")}
                alt={service.serviceName}
              />
            </div>
            <h6 className="service-name">{service.serviceName}</h6>
            <p className="service-price">Rs : {service.price}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default OurCoreServices;
