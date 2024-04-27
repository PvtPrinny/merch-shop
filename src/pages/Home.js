import '../App.css';
import 'react-notifications-component/dist/theme.css'
import { db } from "../config/firebase";
import { auth } from "../config/firebase";
import { Store } from 'react-notifications-component';
import { onAuthStateChanged } from 'firebase/auth';
import { ReactNotifications } from 'react-notifications-component'
import { getDocs, collection, addDoc } from "firebase/firestore";
import { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ShoppingCart from '../components/ShoppingCart.js';
import ShoppingBag from '../assets/shopping-bag-svgrepo-com (black).png';

import Payment from '../components/Payment.js';

//const stripePromise = loadStripe('your_stripe_public_key'); load stripe outside of this component

function Home() {

  const [productList, setProductList] = useState([]); // the product data acquired from firestore database
  const [activeMerch,setActiveMerch] = useState(null); // set the active store item to show off it's description

  const [productsInCart, setProductsInCart] = useState([]); // manages the products in the shopping cart
  const [cartVisibility, setCartVisible] = useState(false); // toggle for shopping cart

  const [user,setUser] = useState({});

  const [toggleLoginRemind,setToggleLoginRemind] = useState(false); // reminds user to log in
  const [paymentScreen,setPaymentScreen] = useState(false);

  const [totalCost,setTotalCost] = useState(0);

  useEffect(() => { // checks whether any user is logged in
    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        if(user=={}){
        }
        else{
          setToggleLoginRemind(false)
        }
    });

  }, [])

  const checkout = () => { //for what comes after checking out
    if(user==null){
      setToggleLoginRemind(true);
      console.log("Need to log in first!!");
      // console.log("Checkout Successful!!");
      // removeAllfromCart();
    }else{
      setPaymentScreen(true);
    }
  }

  useEffect(() => {

    
      const getProductList = async () => { 

      const productCollectionRef = collection(db,"Products");// Function for reading Data from firebase
        // Read data
        // Set product list
        try{
          const data = await getDocs(productCollectionRef); // Grab collection from firestore database
          const filteredData = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          // console.log(filteredData);
          setProductList(filteredData);
        }catch(err){
          console.error(err);
        }
      }
      getProductList();
  },[]);

  function handleMerchClick(index) {
    setActiveMerch(prevActiveMerch => {
      // If the clicked item is already active, do nothing
      if (prevActiveMerch === index) {
        return prevActiveMerch;
      }
      // Otherwise, set the clicked item as active
      // console.log("activeMerch: " + activeMerch)
      return index;
    });
  };

  useEffect(() => {
    let timer;

    const handleOutsideClick = (event) => {
        timer = setTimeout(() => {
            const isOutside = !event.target.closest('.description-container');
            if (isOutside) {
                setActiveMerch(null);
            }
        }, 200); // Delay to prevent 2 function from impacting each other
    };

    const cancelTimer = () => clearTimeout(timer);
    if(activeMerch !== null){
      document.addEventListener('mousedown', handleOutsideClick);
      // console.log("Event listener added");
    };

    return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
        cancelTimer();
        // console.log("Event listener removed");
    };
  }, [activeMerch]);

  function toggleShoppingCart(){
    setCartVisible((prev) => !prev);
  }

  useEffect(() => { // for shopping cart
    const handleOutsideClick = (event) => {
      if(!event.target.closest('.ShoppingBag-btn-div') && !event.target.closest('.ShoppingCart-div')){ // if you click outside of the div with className header-nav and the dropdown bar is already active, proceed;
        setCartVisible(false);
      }
    };
    document.addEventListener('mousedown',handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [cartVisibility]);


  const addToCart = (id, productName, productImg, quantity, productPrice) => {
    setProductsInCart(currentCart => {
      // Find the product in the product list
      const product = productList.find(item => item.id === id);

      if (!product) {
        console.error('Product not found');
        return currentCart;
      }
      
      manageNotification("Success!","item added to shopping cart","success");

      // Check if the product already exists in the cart
      const cartIndex = currentCart.findIndex(item => item.id === id);
      
      if (cartIndex !== -1) {
        // Product exists, update the quantity
      
        const updatedCart = currentCart.map((item, index) => {
          if (index === cartIndex) {
            return { ...item, quantity: quantity};
          }
          return item;
        });
        return updatedCart;
      } else {
        // Product does not exist, add new
        return [
          ...currentCart,
          { id, productName, productImg, quantity, productPrice}
        ];
      }
    });
  };

  const removeFromCart = (id) => { // when a product is removed from cart
    setProductsInCart(prevProducts => {// filter the removed product out
      const updatedProducts = prevProducts.filter(product => product.id !== id);
      // Return the updated cart
      return updatedProducts;
    });
    manageNotification("Success!","item removed from shopping cart","success");

    setProductsInCart(updatedProducts => {//close payment screen if there's no more product in cart
      if (updatedProducts.length === 0) {
        // If it's empty, set paymentScreen to false
        setPaymentScreen(false);
      }
      return updatedProducts;
      })

  }

  const removeAllfromCart = () => { // when clear cart is pressed
    setProductsInCart([]);
    setPaymentScreen(false); // close payment screen
  manageNotification("Success!","All items are removed from shopping cart","success");
  }

  const successfulCheckout = (errors) => { // when clear cart is pressed
    if (Object.keys(errors).length === 0) {
      setProductsInCart([]);
      setPaymentScreen(false);
      manageNotification("Success!", "Checkout Successful!", "success");
    } else {
        // Notify about form errors
        manageNotification("Error", errors, "warning");
        // Optionally, you can log the form errors for debugging
        console.log("Form Errors:", errors);
    }
  }
  const unSuccessfulCheckout = () => { // when clear cart is pressed
    // setProductsInCart([]);
    setPaymentScreen(false);
    manageNotification("Warning","Checkout cancelled!","warning");
  }

  function manageNotification(title, message, type){ // reusable code for addNotification
    Store.addNotification({
      title: title,
      message: message,
      type: type,
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 4000,
        onScreen: true
      }
    })
  }
  
  useEffect(() => {
    // Calculate the total cost
    let totalPrice = 0;
    productsInCart.forEach(product => {
      totalPrice += product.productPrice * product.quantity;
    });
    // Update the totalCost state
    setTotalCost(totalPrice.toFixed(2));
  }, [productsInCart]);

  return (
    <div>
    <ReactNotifications />
    <div className='home-div'>
      <h1 style={{color: 'white'}}>Prinny's Merch Shop</h1>
      
      <div className='ShoppingBag-btn-div' onClick={toggleShoppingCart}>
        <div className="itemInCart">{productsInCart.length}</div>
        <img className="ShoppingBag-btn" src={ShoppingBag} />
      </div>
      <div className='header-home'>
        <Header />
      </div>
      
      {cartVisibility && (
        <div className='ShoppingCart-div'>
          <ShoppingCart
            productsInCart={productsInCart}
            productList={productList} 
            totalCost={totalCost}
            removeFromCart={removeFromCart} 
            checkout={checkout} 
            removeAllfromCart={removeAllfromCart}/>
        </div>
      )}
      
      <div id={toggleLoginRemind ? "page-mask" : ""}>
        { toggleLoginRemind && <div className='Login-Reminder'><div><h3>Need to log in first!!</h3>
          </div>
          <div>
            <button onClick={() => {setToggleLoginRemind(false)}}>Ok</button>
            </div>
          </div>
        }

      <div id={paymentScreen ? "page-mask" : ""}>
        { paymentScreen && 
          // <div className='Checkout-message'>
          
          <div className='Payment-Div'>
            <Payment 
              successfulCheckout={successfulCheckout} 
              unSuccessfulCheckout={unSuccessfulCheckout}
              totalCost={totalCost}
            />
        </div>}
      </div>
      </div>
      <div className="home-item-container">
        {productList.map(product => (
                            <Merch
                                key={product.id}
                                id={product.id}
                                img={product.productImg}
                                productName={product.productName}
                                productPrice={product.productPrice}
                                productQuantity={product.productQuantity}
                                description={product.productDescription}
                                isActive={activeMerch === product.id}
                                onClick={() => handleMerchClick(product.id)}
                                addToCart={addToCart}
                            />
        ))}
      </div>
    </div>
    <Footer />
    </div>
  )
}
function Merch({ id, img, description, isActive, onClick, productName, productPrice, productQuantity, addToCart }) {

  const [showDetails,setShowDetails] = useState(false);
  const [quantity,setQuantity] = useState(0);

  useEffect(() => { // delayed timer for the flex grow's text
    let timer;
    if (isActive){
      timer = setTimeout(()=> setShowDetails(true),200);
    }
    else{
      setShowDetails(false);
      setQuantity(0);
    }
    return () => clearTimeout(timer);
  }, [isActive]);

  const addedToCart = () => {

    if (quantity > 0) {
      addToCart(id, productName, img, quantity, productPrice);
    }
    setQuantity(0);
  }

return (
  <div onClick={onClick} className={`merch-item ${isActive ? 'active' : ''}`}>
    <div className="image-container">
      <img src={img} className="merch-img" alt={description}/>
    </div>
    {showDetails && (
        <div className={`description-container ${isActive ? 'active' : ''}`}>
          <h4>
            {productName}
          </h4>
          <br/>
          <br/>
          <div className="description">
            {description}
          </div>
          <div className="stock-info">
            Price: ${productPrice}
          <br/>
          <br/>
          Current stock: {productQuantity > 0 ? productQuantity : <span style={{color:"red"}}>Out of Stock</span>}
          <br/>
          <br/>
          <div className="quantity-button">
            <button onClick={() => {if(quantity>0)setQuantity(quantity - 1)}}>-</button>
            {'\u00A0'}
            {quantity}
            {'\u00A0'}
            <button onClick={() => {if(quantity<productQuantity)setQuantity(quantity + 1)}}>+</button>
          </div>
          <br/>
          <button className="addCart-button" onClick={addedToCart}>Add to cart</button>
          </div>
        </div>
    )}
  </div>
)
}


export default Home


