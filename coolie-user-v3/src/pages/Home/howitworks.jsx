import React from "react";
import "./Howitworks.css";
import howitworks1 from "../../assets/images/how-it-works-1.png";
import howitworks2 from "../../assets/images/how-it-works-2.png";
import howitworks3 from "../../assets/images/how-it-works-3.png";
import howitworks4 from "../../assets/images/how-it-works-4.png";
import howitworks5 from "../../assets/images/how-it-works-5.png";
import rightarrow from "../../assets/images/right-arrow.png";

const Howitworks = () => {
  return (
    <div className="how-it-works-main-con">
      <h1 className="above-headddig">
        How it works for you ?
      </h1>
      <div className="how-main-flow">
        <div className="how-sub-flow hone">
            <h1>Book a service</h1>
            <p>Choose a wide range of services available at your fingertips. With just a few clicks, book a service at your convenient time that works best for you  and we’ll take care of the rest.</p>
            <div className="h-i-w-i">
            <img src={howitworks1} alt="h-i-w"/>
            </div>
            <div className="flow">1</div>
        </div>
        <div className="how-sub-flow two">
            <h1>Get Confirmation</h1>
            <p>     You will receive a booking confirmation as soon as we assign a service professional. We keep you updated every step of the way with real-time notifications. Your satisfaction is our priority .</p>
            <div className="h-i-w-i">
            <img src={howitworks4} alt="h-i-w"/>
            </div>
            
            <div className="flow ftwo">2</div>
        </div>
        <div className="how-sub-flow  three">
            <h1>Technician Arrives</h1>
                <p>A qualified, background-verified professional will arrive at your doorstep at the scheduled time. Our experts come prepared with the tools and knowledge to get the job done efficiently.
                .</p>
                <div className="h-i-w-i">
            <img src={howitworks2} alt="h-i-w"/>
            </div>
                <div className="flow fthree">3</div>
            </div>
        <div className="how-sub-flow four">
            <h1>Service done</h1>
                <p>After completing the service, our professional ensures you’re satisfied before leaving. Provide feedback and rate your experience to help us maintain our high standards
                .</p>
                <div className="h-i-w-i">
            <img src={howitworks3} alt="h-i-w"/>
            </div>
                <div className="flow ffour">4</div>
            </div>
       
      </div>
    </div>
  );
};

export default Howitworks;
