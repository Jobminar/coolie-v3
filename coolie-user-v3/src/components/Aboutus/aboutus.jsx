import './aboutus.css'
import dirpropic from '../../assets/images/dir-pro-pic.png'
import pro1 from '../../assets/images/pro-1.png'
import pro2 from '../../assets/images/pro-2.png'
import logo from '../../assets/images/coolie-logo.png'
import aboutbottom from '../../assets/images/about-bottom.jpg'

const Aboutus =()=>{
     return(
        <>
          <div className="aboutus-main-img">
              
          </div>
          <div className="our-leadership">
              <h2>Our Leadership Team</h2>
              <div className="leadership-team">
                 <div className='team'>
                    <img src={dirpropic} alt='dirpic'/>  
                    <h3>Chandra sekhar</h3>
                    <p>CEO & Co-founder, Coolie no.1</p>   
                    <div className='team-contact'>
                        <img src={pro1} alt='team contact'/>
                        <img src={pro2} alt='team contact'/>
                    </div> 
                    <p className='team-content'>Chandra Shekar, the CEO of Coolie No.1 Company, has transformed the logistics industry with innovative strategies and a commitment to excellence. Under his leadership, the company has achieved remarkable growth, emphasizing employee welfare and sustainable practices. His visionary approach continues to drive the company toward new heights of success.</p>                    
                 </div>
                 <div className='team'>
                    <img src={dirpropic} alt='dirpic'/>  
                    <h3>Chandra sekhar</h3>
                    <p>CEO & Co-founder, Coolie no.1</p>   
                    <div className='team-contact'>
                        <img src={pro1} alt='team contact'/>
                        <img src={pro2} alt='team contact'/>
                    </div> 
                    <p className='team-content'>Chandra Shekar, the CEO of Coolie No.1 Company, has transformed the logistics industry with innovative strategies and a commitment to excellence. Under his leadership, the company has achieved remarkable growth, emphasizing employee welfare and sustainable practices. His visionary approach continues to drive the company toward new heights of success.</p>                    
                 </div>
                 <div className='team'>
                    <img src={dirpropic} alt='dirpic'/>  
                    <h3>Chandra sekhar</h3>
                    <p>CEO & Co-founder, Coolie no.1</p>   
                    <div className='team-contact'>
                        <img src={pro1} alt='team contact'/>
                        <img src={pro2} alt='team contact'/>
                    </div> 
                    <p className='team-content'>Chandra Shekar, the CEO of Coolie No.1 Company, has transformed the logistics industry with innovative strategies and a commitment to excellence. Under his leadership, the company has achieved remarkable growth, emphasizing employee welfare and sustainable practices. His visionary approach continues to drive the company toward new heights of success.</p>                    
                 </div>
              </div>
          </div>
          <div className='about-company'>
              <div className='company-logo'> 
                  <img src={logo} alt='logo'/>
              </div>
              <div className='company-content'> 
                  <h2>Our Company Overview</h2>
                  <p>Coolie no-1 is a technology platform offering a variety of services at home. Customers use our platform to book services such as beauty treatments, haircuts, massage therapy, cleaning, plumbing, carpentry, appliance repair, painting etc. These services are delivered in the comfort of their home and at a time of their choosing. We promise our customers a high quality, standardised and reliable service experience. To fulfill this promise, we work closely with our hand-picked service partners, enabling them with technology, training, products, tools, financing, insurance and brand, helping them succeed and deliver on this promise.<br/>Our Vision: Empower millions of professionals worldwide to deliver services at home like never experienced before</p>
                  <hr/>
                  <p>Coolie no-1, is an Indian-based company that offers a wide range of home and local services. The company operates on a marketplace model, providing training to its partners and ensuring quality through customer feedback. Technology plays a key role, with an app-based system facilitating service bookings, order tracking, and payments.  By emphasizing customer satisfaction and maintaining high service standards,Coolie no-1 has revolutionized the local services market, making it easier for customers to find reliable professionals while providing a platform for skilled workers to enhance their earnings. The company's innovative approach and significant funding have fueled its growth and allowed it to continuously add new services and enter new markets.</p>
              </div>
          </div>
          <div className='about-bottom'>
                     <img src={aboutbottom} alt='about-bottom'/>
            </div>
        </>
     )
} 
export default Aboutus