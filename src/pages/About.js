import '../App.css';
import React from 'react';
import Header from '../components/Header';
import Footer2 from '../components/Footer2';

const About = () => {
  return (
    <div>
      <Header/>
      <div style={{color:'white'} } className="about-div">
        <h1>About This Page</h1><br />
        <div className='about-content'>
          <h3>This webpage was made for me to practice making an e-commerce webpage of a game's merch store using React.js</h3>
          <h3>It's still a work in progress but you can create an account, log in and then add multiple products to shopping cart and checkout.</h3>
        </div>
      </div>
      <Footer2 />
    </div>
  )
}

export default About
