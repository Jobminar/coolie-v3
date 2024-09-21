import React from 'react'
import './RegisterAsProfessional.css'
import { useEffect,useState } from 'react';
import rsapimage from '../../assets/images/r-s-a-p.png'
import india from '../../assets/images/English.png'

const RegisterAsProfessional = () => {

    const [text, setText] = useState('Earn');

    useEffect(() => {
      const texts = ['Earn', 'Respect', 'Safety Ensured'];
      let index = 0;
  
      const interval = setInterval(() => {
        index = (index + 1) % texts.length;
        setText(texts[index]);
      }, 2000); 
  
      return () => clearInterval(interval);
    }, []);

  return (
      <>
      <div className='r-a-p-main-con'>
        <div className='r-a-p-absolute-main-con'>
            <div className='r-a-p-top-con'>
            <div className='r-a-p-content'>
                      <h2>More <span>{text}</span></h2> 
                      <p>Join 40,000+ partners across India, USA,<br/> Singapore,UAE and many more</p>
              </div>
              <div className='r-s-a-p-image'>
                 <img src={rsapimage} alt='image'/>
              </div>
            </div>
              
              <div className='absolute-item-con'>
                    <p>Share your WhatsApp number and we'll reach out via our WhatsApp Business Account.</p>
                    <div className='a-i-con'>
                        <div className='mobile-input'>
                            <img src={india} alt='india'/>
                            <input placeholder='Enter your mobile number'/>
                        </div>   
                        <button>
                            Join us
                        </button>
                    </div>
                </div>
        </div>
        <div  className='join-coolie'>
             <h2> Join Task Tigers to change your life</h2>
             <p>Coolie is an app-based marketplace that empowers professionals like you to become your own boss</p>
             
        </div>
      

      </div>
      </>
  )
}

export default RegisterAsProfessional