import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "./applianceRepair.css";
import acRepair from "../../../assets/images/AC-repair.png";
import purifierService from "../../../assets/images/purifier-service.png";
import washingMachineRepair from "../../../assets/images/Washing-machine-repair.png";
import fanRepair from "../../../assets/images/fan-repair.png";
import newACInstallation from "../../../assets/images/AC-installation.png";
import tvRepair from "../../../assets/images/TV-repair.png";
import doorbellInstallation from "../../../assets/images/Doorbell-installation.png";
import interiorLightingDevices from "../../../assets/images/Lighting-Repair.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ApplianceRepair = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const services = [
    { id: 1, name: "AC Repair", price: "Starting at ₹50", image: acRepair },
    { id: 2, name: "Water Purifier Repair", price: "Starting at ₹40", image: purifierService },
    { id: 3, name: "Washing Machine Repair", price: "Starting at ₹60", image: washingMachineRepair },
    { id: 4, name: "Ceiling Fan Repair", price: "Starting at ₹50", image: fanRepair },
    { id: 5, name: "AC Maintenance", price: "Starting at ₹1000", image: newACInstallation },
    { id: 6, name: "TV Repair", price: "Starting at ₹500", image: tvRepair },
    { id: 7, name: "Doorbell Installation", price: "Starting at ₹150", image: doorbellInstallation },
    { id: 8, name: "Interior Lighting", price: "Starting at ₹200", image: interiorLightingDevices },
  ];

  // Effect to hide/show the "Next" button based on the current index
  useEffect(() => {
    const nextButton = document.querySelector(".slick-next");
    if (currentIndex >= services.length - 4) {  // Adjust index check by -1 to display the last item correctly
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
    );
  };

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
      <h2>AC & Appliance Repair</h2>
      <Slider {...settings} className="appliance-repair-slider">
        {services.map((service) => (
          <div key={service.id} className="appliance-repair-item">
            <div className="appliance-repair-image">
              <img src={service.image} alt={service.name} className="carousel-image" />
            </div>
            <div className="appliance-repair-name">{service.name}</div>
            <div className="appliance-repair-price">{service.price}</div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ApplianceRepair;
