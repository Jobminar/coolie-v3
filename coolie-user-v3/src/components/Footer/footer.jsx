import './footer.css'
import logo from '../../assets/images/logo.png'
import facebook from '../../assets/images/facebook.png'
import x from '../../assets/images/x.png'
import linkedin from '../../assets/images/linkedin.png'
import instagram from '../../assets/images/instagram.png'
import googleplaystore from '../../assets/images/google-playstore.svg'
import applestore from '../../assets/images/apple-store.svg'
import { useNavigate } from 'react-router-dom'
import payments from '../../assets/images/payments.png'
import { useState } from 'react'

const Footer = () => {
    const navigate = useNavigate()
    const [showLocations, setShowLocations] = useState(false)

    const toggleLocations = () => {
        setShowLocations(!showLocations)
    }

    return (
        <>
            <div className='main-footer'>
                <div className='top-footer'>
                    <div>
                    <div className='t-logo'>
                        <img src={logo} alt='logo' />
                    </div>
                    <div className='t-inputs'>
                        <div className='emaildrop'>
                            <input className='input' placeholder='Please enter your Email / Phone No' />
                        </div>
                        <div>
                            <button className='t-button'>SUBSCRIBE</button>
                        </div>
                    </div>
                    </div>
                    <div className='play'>
                    <div className='play-apple'>
                        <p>Download App</p>
                        <div className='p-a-store'>
                            <img src={googleplaystore} alt='playstore' />
                            <img src={applestore} alt='playstore' />
                        </div>
                    </div>
                </div>
                </div>

                <div className="bottom-footer">
                    <div className="first-footer">
                        <div>
                            <p>COMPANY </p>
                            <li onClick={() => { navigate('/aboutus') }}>About us</li>
                            <li>Reviews</li>
                            <li>Contact us</li>
                            <li>Careers</li>
                            <li className='seemore'  onClick={toggleLocations}>
                            {showLocations ? 'Hide locations' : 'Serving locations'}</li>
                        </div>
                        <div>
                            <p>OUR SERVICES</p>
                            <li>cleaning</li>
                            <li>plumbing</li>
                            <li>carpentory</li>
                            <li onClick={()=>{navigate('/services')}}>...more</li>
                        </div>
                        <div>
                            <p>TERMS & POLICES</p>
                            <li>Refund policy</li>
                            <li onClick={() => navigate('/privacypolicy')}>Privacy policy</li>
                            <li>Welfare policy</li>
                            <li>Blogs</li>
                        </div>
                    </div>

                    <div className="last-footer">
                        <div className='followus'>
                            <p className='follow-us'>Follow us</p>
                            <div className='s-m-icons'>
                                <div className='s-m-i'>
                                    <img src={facebook} alt='social media icons' />
                                </div>
                                <div className='s-m-i'>
                                    <img src={instagram} alt='social media icons' />
                                </div>
                                <div className='s-m-i'>
                                    <img src={x} alt='social media icons' />
                                </div>
                                <div className='s-m-i'>
                                    <img src={linkedin} alt='social media icons' />
                                </div>
                            </div>
                        </div>
                        <div className='payment'>
                            <p>Payment options</p>
                            <img src={payments} alt='payments' />
                        </div>
                    </div>
                </div>

                

                {/* Toggle the visibility of locations */}
                {showLocations && (
                    <div className='locations'>
                        <p>Anakapalli</p>
                        <p>Anantapur</p>
                        <p>Annamayya</p>
                        <p>Bapatla</p>
                        <p>Chittoor</p>
                        <p>East Godavari</p>
                        <p>Eluru</p>
                        <p>Guntur</p>
                        <p>Kakinada</p>
                        <p>Krishna</p>
                        <p>Kurnool</p>
                        <p>Konaseema</p>
                        <p>Nandyal</p>
                        <p>NTR District</p>
                        <p>Palnadu</p>
                        <p>Parvathipuram Manyam</p>
                        <p>Prakasam</p>
                        <p>Sri Potti Sriramulu Nellore</p>
                        <p>Srikakulam</p>
                        <p>Sri Sathya Sai</p>
                        <p>Tirupati</p>
                        <p>Visakhapatnam</p>
                        <p>Vizianagaram</p>
                        <p>West Godavari</p>
                        <p>YSR (Kadapa)</p>
                        <p>Alluri Sitharama Raju</p>
                        <p>Adilabad</p>
                        <p>Bhadradri Kothagudem</p>
                        <p>Hyderabad</p>
                        <p>Jagtial</p>
                        <p>Jangaon</p>
                        <p>Jayashankar Bhupalpally</p>
                        <p>Jogulamba Gadwal</p>
                        <p>Kamareddy</p>
                        <p>Karimnagar</p>
                        <p>Khammam</p>
                        <p>Komaram Bheem Asifabad</p>
                        <p>Mahabubabad</p>
                        <p>Mahabubnagar</p>
                        <p>Mancherial</p>
                        <p>Medak</p>
                        <p>Medchal-Malkajgiri</p>
                        <p>Mulugu</p>
                        <p>Nagarkurnool</p>
                        <p>Nalgonda</p>
                        <p>Narayanpet</p>
                        <p>Nirmal</p>
                        <p>Nizamabad</p>
                        <p>Peddapalli</p>
                        <p>Rajanna Sircilla</p>
                        <p>Ranga Reddy</p>
                        <p>Sangareddy</p>
                        <p>Siddipet</p>
                        <p>Suryapet</p>
                        <p>Vikarabad</p>
                        <p>Wanaparthy</p>
                        <p>Warangal</p>
                        <p>Hanamkonda</p>
                        <p>Yadadri Bhuvanagiri</p>
                    </div>
                )}
            </div>
        </>
    )
}

export default Footer
