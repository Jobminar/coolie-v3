import React from 'react'
import './womenSaloon.css'
import saloon1 from '../../../assets/images/saloon-women-1.png'
import saloon2 from '../../../assets/images/saloon-women-2.png'
import saloon3 from '../../../assets/images/saloon-women-3.png'
import saloon4 from '../../../assets/images/women-saloon-4.png'
import saloon5 from '../../../assets/images/women-saloon-5.png'

const WomenSloon = () => {
  return (
    <>
             <h2 className='w-s-headding'>Saloon for Women</h2>
            <div className='women-saloon-main-con'>
                <div className='w-s-sub-con'>
                    <p>Waxing</p>
                    <img src={saloon1} alt='saloon1'/>
                </div>
                <div className='w-s-sub-con'>
                    <p>Pedicure</p>
                    <img src={saloon2} alt='saloon1'/>
                </div>
                <div className='w-s-sub-con'>
                    <p>Manicure</p>
                    <img src={saloon3} alt='saloon1'/>
                </div>
                <div className='w-s-sub-con'>
                    <p>Facial & Cleanup</p>
                    <img src={saloon4} alt='saloon1'/>
                </div>
                <div className='w-s-sub-con'>
                    <p>Hair care</p>
                    <img src={saloon5} alt='saloon1'/>
                </div>
            </div>
    </>
    
  )
}

export default WomenSloon