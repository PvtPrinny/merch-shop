import '../App.css';
import PLogo from '../Prinny.png'
import PLogo2 from '../C1_Xs9lVEAAxd1E.png'
import HomeLogo from '../home.png'
import { Link } from 'react-router-dom';
import { Auth } from "../components/Auth"; // for logging in
import { auth } from "../config/firebase";
import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth';


const Header = () => {

  const [user,setUser] = useState({});
  const [logo,setLogo] = useState(PLogo);
  const [isOpen,setIsOpen] = useState(false);
  const [loginScreenVisible, setLoginScreenVisible] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        if(user!={}){
          setLoginScreenVisible(false);
        }
    });
  }, [])

  const handleClick = (e) => {
    setLogo(prev => (prev === PLogo ? PLogo2 : PLogo));
    setIsOpen(!isOpen);
  }

  const handleLoginClick = () => {
    if(loginScreenVisible!=true)
    setLoginScreenVisible(true);
  }

  useEffect(() => { // for the prinny on top right;
    const handleOutsideClick = (event) => {
      if(!event.target.closest('.header-nav') && isOpen){ // if you click outside of the div with className header-nav and the dropdown bar is already active, proceed;
        setIsOpen(false); //Set the dropdown bar to close;
        setLogo(PLogo); //Set the logo to the closed one;
      }
    };
    document.addEventListener('mousedown',handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]); // Will only work when isOpen is changed.

  useEffect(() => { // for sign-in
    const handleOutsideClick = (event) => {
      if(!event.target.closest('.auth-form')){ // if you click outside of the div with className auth-form, proceed;
        setLoginScreenVisible(false); //Set the loginScreen to close;
      }
    };
    document.addEventListener('mousedown',handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [loginScreenVisible]); // Will only work when loginScreenVisible is changed.;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Error signing out: ', err);
    }
  };
    
  return (
    <div>
      {user && user.email ? 
        (<div className="User-Status">
          <h3 style={{color: 'white'}}>Welcome, user {user.email}
            {'\u00A0'}
            {'\u00A0'}
            <button onClick={handleSignOut}>Sign Out</button>
          </h3>
        </div>
        )
      : 
        (!user && !user?.email && <button className="sign-in" onClick={handleLoginClick}>Sign-in</button>)
      }
      <nav className="header-nav">
        <nav className="menu-container">
          <nav className="header-trigger">
            <img src={logo} alt="prinny logo top right" className="header-logo" onClick={handleClick} />
          </nav>
          <nav className={`dropdown-menu ${logo === PLogo2 ? 'active' : 'inactive'}`}>
            <ul>
              <DropdownItem img = {HomeLogo} text={""} linkName={"Home"} />
              <DropdownItem img = {HomeLogo} text={"About"} linkName={"About"}/>
            </ul>
          </nav>
        </nav>
      </nav>
      <div id={loginScreenVisible ? "page-mask" : ""}>
      </div>
      <div className={loginScreenVisible ? 'auth-form': ''}>
          {loginScreenVisible && <Auth loginScreenVisible={loginScreenVisible} />}
      </div>
    </div>
  )
}



function DropdownItem(props){

  return(
    <li className = 'dropdownItem'>
      <img src={props.img} alt={props.linkName}></img>
      <Link to={`/${props.text}`}>{props.linkName}</Link>
    </li>
  );
}

export default Header
