import React from "react";
import Maincategory from "../Home/maincategory";
import Mostbookedservices from "./MOST-BOOKED-SERVICES/mostbookedservices";
import Howitworks from "../Home/howitworks";
import Ourcoreservices from "./OUR-CORE-SERVICES/our-core-services";
import ApplianceRepair from "./Appliance-Services/ApplianceRepair";
import "./home.css";
import OurPopularServices from "./OurPopularServices/OurPopularServices";
import WomenSloon from "./Women-saloon/womenSloon";
import Mensaloon from "./Men-saloon/mensaloon";
import Test from "./test";

const Home = () => {
  return (
    <div className="home-main">
      <Maincategory />
      <Mostbookedservices />
      <WomenSloon/>
      <Howitworks />
      <ApplianceRepair />
      <Mensaloon/>
      <OurPopularServices />
      {/* <Ourcoreservices /> */}
      {/* <Test/> */}
    </div>
  );
};

export default Home;
