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
import SpaWomen from "./Spa-women/spaWomen";


const Home = () => {
  return (
    <div className="home-main">
      <Maincategory />
      {/* <Mostbookedservices /> */}
      <WomenSloon/>
      <SpaWomen/>
      <Howitworks />
      <ApplianceRepair />
      <OurPopularServices />
      {/* <Ourcoreservices /> */}
      {/* <Test/> */}
      <Mensaloon/>
    </div>
  );
};

export default Home;
