import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../Appliance-Services/applianceRepair.css'

const CarouselComponent = () => {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.coolieno1.in/v1.0/admin/most-booked"
        );
        const data = await response.json();
        setItems(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const nextButton = document.querySelector('.slick-next');
    if (currentIndex >= items.length - 4) {
      nextButton.style.display = 'none';
    } else {
      nextButton.style.display = 'block';
    }
  }, [currentIndex, items.length]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
      <h2>Most booked services</h2>
      
      <Slider {...settings} className="appliance-repair-slider">
        
        {items.map((item, index) => (
          <div key={index} className="appliance-repair-item">
            <div className="appliance-repair-image">
            <img src={item.image} alt={item.name} className="carousel-image" />
            </div>      
            <div className="appliance-repair-name">{item.name}</div>
            <p className="appliance-repair-price">Rs: {item.price}</p>
          </div>
        ))}
       
        
      </Slider>
      
    </div>
  );
};

export default CarouselComponent;
