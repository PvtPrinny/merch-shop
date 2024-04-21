import '../App.css';
import { useState, useEffect, useMemo } from 'react';
import ShoppingBag from '../assets/shopping-bag-svgrepo-com (black).png';
import { db } from "../config/firebase";
import { getDocs, collection, addDoc } from "firebase/firestore";
import ShoppingCart from '../components/ShoppingCart.js';
import { auth } from "../config/firebase";
import { onAuthStateChanged } from 'firebase/auth';

function Home() {

  const [productList, setProductList] = useState([]);
  const [activeMerch,setActiveMerch] = useState(null);

  const [productsInCart, setProductsInCart] = useState([]);
  const [cartVisibility, setCartVisible] = useState(false);

  const [totalCost, setTotalCost] = useState(0);

  const [user,setUser] = useState({});

  const [toggleLoginRemind,setToggleLoginRemind] = useState(false);
  const [successfulMessage,setSuccessfulMessage] = useState(false);

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
    }else{
      setSuccessfulMessage(true);
      console.log("Checkout Successful!!");
      removeAllfromCart();
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
      console.log("Event listener added");
    };

    return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
        cancelTimer();
        console.log("Event listener removed");
    };
  }, [activeMerch]);

  function toggleShoppingCart(){
    setCartVisible((prev) => !prev);
  }

  useEffect(() => { // for shopping cart
    const handleOutsideClick = (event) => {
      if(!event.target.closest('.ShoppingBag-btn-div')&& !event.target.closest('.ShoppingCart-div')){ // if you click outside of the div with className header-nav and the dropdown bar is already active, proceed;
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

  const removeFromCart = (id) => {
    setProductsInCart(prevProducts => prevProducts.filter(product => product.id !==id));
  }

  const removeAllfromCart = () => {
    setProductsInCart([]);
  }
  
  return (
    
    <div className='home-div'>
      <h1 style={{color: 'white'}}>Prinny's Merch Shop</h1>
      
      <div className='ShoppingBag-btn-div' onClick={toggleShoppingCart}>
        <div className="itemInCart">{productsInCart.length}</div>
        <img className="ShoppingBag-btn" src={ShoppingBag} />
      </div>
      {cartVisibility && (
        <div className='ShoppingCart-div'><ShoppingCart productsInCart={productsInCart} productList={productList} removeFromCart={removeFromCart} checkout={checkout} removeAllfromCart={removeAllfromCart}/>
        </div>
      )}
      { toggleLoginRemind && <div className='Login-Reminder'><div><h3>Need to log in first!!</h3></div>
      <div><button onClick={() => {setToggleLoginRemind(false)}}>Ok</button></div></div>}

      { successfulMessage && <div className='Login-Reminder'><div><h3>Checkout Successful!!</h3><h4>Payment screen WIP</h4></div>
      <div><button onClick={() => {setSuccessfulMessage(false)}}>Ok</button></div></div>}

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
          {productName}
          <br/>
          <br/>
          <div className="description">
              {description}
          </div>
          <br/>
          <br/>
          <br/>
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


