import React, { useEffect, useState } from 'react';
import './Packages.css';
import savemoney from '../../../assets/images/savemoney.svg';
import offer from '../../../assets/images/offer.svg';
import add from '../../../assets/images/add.png';
import minus from '../../../assets/images/minus.png';

const Packages = () => {
  const [faq, setFaqs] = useState([]);
  const [packages, setPackages] = useState([]);
  const [openFaqIndex, setOpenFaqIndex] = useState(null); // Track open FAQ for toggling

  // Fetch FAQs
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch('https://api.coolieno1.in/v1.0/users/faq-package');
        const data = await response.json();
        setFaqs(data);
        console.log(data, 'faqs');
      } catch (err) {
        console.log(err);
      }
    };
    fetchFaqs();
  }, []);

  // Fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('https://api.coolieno1.in/v1.0/admin/admin-user-package');
        const data = await response.json();
        setPackages(data);
        console.log(data,'packages data')
      } catch (err) {
        console.log(err);
      }
    };
    fetchPackages();
  }, []);

  

  // Toggle FAQ answer visibility
  const handleToggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index); // Open/close the answer
  };

  return (
    <>
      <div className='save-money-main-con'>
        <div className='savemoney-svg'>
          <img src={savemoney} alt='Save Money' />
        </div>
        <h2 className='s-m-headding'>Save more % on Bookings</h2>
        <div className='s-m-main-con'>
          <div className='s-m-sub-con'>
            <p className='plus'>Plus benefits</p>
            <img src={offer} alt='Offer' className='offer-s-m-badge' />
            <p className='percent-off'>Get 10% off on all categories</p>
            <p className='enjoy'>Enjoy 10% discount on all bookings in any category</p>
          </div>

          <div className='s-m-p-sub-con'>
          {
            Array.isArray(packages) && packages.length > 0 ? (
              packages.map((item, index) => (
                  <div className='package-main-con' key={index}>
                      <div className='package-sub-con'> 
                         <p>validity :{item.validity}</p>
                         <p>Price : {item.priceRs}</p>
                         <button className='add-p-button'>ADD</button>
                     </div>
                  </div>
              ))
            ) : (
              <p>No FAQs available</p>
            )
          }
          </div>
        </div>

        <div className='f-a-q-main-con'>
          <h2 className='faq-headding'>FAQ'S</h2>
          <p className='faq-sub-headding'>Frequently Asked Questions</p>
          <p className='faq-content'>Have questions? we are here to help you</p>
          {
            Array.isArray(faq) && faq.length > 0 ? (
              faq.map((item, index) => (
                <div key={index} className='faq-sub-con'>
                  <div className='question-con'>
                    <p className='question'>{item.question}</p>
                    <img 
                      src={add} 
                      alt='add' 
                      className='add-button' 
                      style={{ display: openFaqIndex === index ? 'none' : 'block' }}
                      onClick={() => handleToggleFaq(index)} 
                    />
                    <img 
                      src={minus} 
                      alt='minus' 
                      className='minus-button' 
                      style={{ display: openFaqIndex === index ? 'block' : 'none' }}
                      onClick={() => handleToggleFaq(index)} 
                    />
                  </div>
                  <p className='answer' style={{ display: openFaqIndex === index ? 'block' : 'none' }}>
                    {item.answer}
                  </p>
                </div>
              ))
            ) : (
              <p>No FAQs available</p>
            )
          }
        </div>
      </div>
    </>
  );
};

export default Packages;
