import React from 'react'
import '../Women-saloon/womenSaloon.css'
import saloon1 from '../../../assets/images/m-1.png'
import saloon2 from '../../../assets/images/m-2.png'
import saloon3 from '../../../assets/images/m-3.png'
import saloon4 from '../../../assets/images/m-4.png'
import saloon5 from '../../../assets/images/m-5.png'

const Mensaloon = () => {
  return (
    <>
         <h2 className='w-s-headding'>Saloon for Men</h2>
         <div>
            
         </div>
            <div className='women-saloon-main-con'>
                <div className='w-s-sub-con'>
                    <p>Hair cutting & <br/> Grooming</p>
                    <img src={saloon1} alt='saloon1'/>
                </div>
                <div className='w-s-sub-con'>
                    <p>Pedicure</p>
                    <img src={saloon2} alt='saloon1'/>
                </div>
                <div className='w-s-sub-con'>
                    <p>Hair colour</p>
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

export default Mensaloon