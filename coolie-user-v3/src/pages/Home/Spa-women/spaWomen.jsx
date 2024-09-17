import React from 'react'
import '../Women-saloon/womenSaloon.css'
import saloon1 from '../../../assets/images/saloon-women-1.png'
import saloon2 from '../../../assets/images/saloon-women-2.png'
import saloon3 from '../../../assets/images/saloon-women-3.png'
import saloon4 from '../../../assets/images/women-saloon-4.png'
import saloon5 from '../../../assets/images/women-saloon-5.png'

const SpaWomen = () => {
  return (
       <>
            <h2 className='w-s-headding'>Spa for Women</h2>
            <div className='women-spa-main-con'>
                <div className='w-s-sub-con'>
                    <p>Head massage</p>
                    <img src={saloon1} alt='saloon1'/>
                </div>
                <div className='w-s-sub-con'>
                    <p>Pain relif</p>
                    <img src={saloon2} alt='saloon1'/>
                </div>
                <div className='w-s-sub-con'>
                    <p>Natural skincare</p>
                    <img src={saloon3} alt='saloon1'/>
                </div>
                <div className='w-s-sub-con'>
                    <p>Body massage</p>
                    <img src={saloon4} alt='saloon1'/>
                </div>
            </div>
       </>
  )
}

export default SpaWomen