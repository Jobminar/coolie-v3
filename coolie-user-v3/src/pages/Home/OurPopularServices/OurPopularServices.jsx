import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "../Appliance-Services/applianceRepair.css";
import salonForWomen from "../../../assets/images/facial-makeup.png";
import sofaCleaning from "../../../assets/images/sofa-cleaning.png";
import pestControl from "../../../assets/images/pest-control.png";
import waxServices from "../../../assets/images/waxing.png";
import headMassage from "../../../assets/images/head-massage.png";
import hairSetForWomen from "../../../assets/images/hairset-women.png";
import hairWash from "../../../assets/images/hair-wash.png";
import nailPolish from "../../../assets/images/nail-polish.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const OurPopularServices = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const services = [
    {
      id: 1,
      name: "Salon for Women",
      price: "Starting at ₹200",
      image: salonForWomen,
    },
    {
      id: 2,
      name: "Sofa Cleaning",
      price: "Starting at ₹500",
      image: sofaCleaning,
    },
    {
      id: 3,
      name: "Pest Control",
      price: "Starting at ₹300",
      image: pestControl,
    },
    {
      id: 4,
      name: "Waxing",
      price: "Starting at ₹150",
      image: waxServices,
    },
    {
      id: 5,
      name: "Head Massage",
      price: "Starting at ₹250",
      image: headMassage,
    },
    {
      id: 6,
      name: "Hair Set for Women",
      price: "Starting at ₹400",
      image: hairSetForWomen,
    },
    {
      id: 7,
      name: "Hair Wash",
      price: "Starting at ₹100",
      image: hairWash,
    },
    {
      id: 8,
      name: "Nail Polish",
      price: "Starting at ₹50",
      image: nailPolish,
    },
  ];

  // Effect to hide/show the "Next" button based on the current index
  useEffect(() => {
    const nextButton = document.querySelector(".slick-next");
    if (currentIndex >= services.length - 5) {
      nextButton.style.display = "none";
    } else {
      nextButton.style.display = "block";
    }
  }, [currentIndex, services.length]);


  
  const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} appliance-custom-next-arrow`}
        style={{
          ...style,
          right: "-1.5rem",
          
        }}
        onClick={onClick}
      >
       
      </div>
    );
  };

  const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} appliance-custom-prev-arrow`}
        style={{
          ...style,
          left: "-1.7rem",
          zIndex: 2,
        }}
        onClick={onClick}
      >
      
      </div>
    );}


    const settings = {
      dots: false,
      infinite: false, // Disable infinite scroll to hide the "Next" button when reaching the end
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 1,
      autoplay: false,
      autoplaySpeed: 3000,
      arrows: true,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      afterChange: (index) => setCurrentIndex(index), // Update current index on slide change
      responsive: [
        {
          breakpoint: 1244,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 850,
          settings: {
            slidesToShow: 2.5,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 700,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 560,
          settings: {
            slidesToShow: 1.5,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 430,
          settings: {
            slidesToShow: 1.2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 360,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };
  

 
    return (
      <div className="appliance-repair-main-con">
        <h2>Our popular services</h2>
        <Slider {...settings} className="appliance-repair-slider">
          {services.map((service) => (
            <div key={service.id} className="appliance-repair-item">
              <div className="appliance-repair-image">
                <img src={service.image} alt={service.name} />
              </div>
              <div className="appliance-repair-name">{service.name}</div>
              <div className="appliance-repair-price">{service.price}</div>
            </div>
          ))}
        </Slider>
      </div>
    );
};

export default OurPopularServices;
