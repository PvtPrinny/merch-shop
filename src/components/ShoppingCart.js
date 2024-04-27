import '../App.css';
import React, { useState, useEffect } from 'react'


const ShoppingCart = ({productsInCart, removeFromCart, checkout, removeAllfromCart, totalCost} ) => {

    // const checkoutPrice = () => {
    //     let totalPrice = 0;
    //     productsInCart.forEach(product => {
    //       totalPrice += product.productPrice * product.quantity;
    //     })
    //     return(totalPrice.toFixed(2));
    // }

    return (
        <div className="ShoppingCartContent">
            {productsInCart.length > 0 ? (
            (
                productsInCart.map((product, index) => (
                    <div className="ShoppingCartItem" key={index}>
                        <img className="CartProductImg" src={product.productImg} alt={product.productName} />
                        <div className="CartProductDescription">
                            <p>{product.productName}</p>
                            <p>Quantity: {product.quantity}</p>
                            <p>Price: ${(product.productPrice*product.quantity).toFixed(2)}</p>
                        </div>
                        <div className='CartProductRemoveBtn'>
                            <button onClick={() => {removeFromCart(product.id)}}>Remove</button>
                        </div>
                    </div>
                ))
            )
            ):(
                <div className='EmptyCartMessage'>The Shopping Cart is currently empty</div>
            )}
            {(productsInCart.length > 0) && (
                <div className='checkoutInfo'>
                    <h4 className='totalPrice'>Total Price: ${totalCost}</h4>
                    <button className="checkoutBtn" onClick={() => {removeAllfromCart()}}>clear cart</button>
                    <button className='checkoutBtn' onClick={()=>{checkout()}}>checkout</button>
                </div>
            )}
        </div>
    )


}

export default ShoppingCart
