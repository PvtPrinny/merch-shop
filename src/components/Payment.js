import '../App.css';
import React, { useState, useEffect } from 'react';
import VisaCardSample from '../assets/VisaCardSample.png';

function Payment ( {successfulCheckout, unSuccessfulCheckout, totalCost}){

    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        expiryYear: '',
        expiryMonth: '',
        cvc: '',
        name: ''
      });
    const [formError, setFormError] = useState({});

    const handleChange = (event) => {
        setPaymentData({...paymentData, [event.target.name]: event.target.value}) // iterate through the data and handle target's change
        setFormError({...formError, [event.target.name]: ''});
    }

    function handleCardNumber (event) {
        const { value } = event.target;
        const formattedNumber = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim(); // replaces every 5th digit with space
        setPaymentData(prevPaymentData => ({
            ...prevPaymentData,
            cardNumber: formattedNumber
        }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let errors = "";


        Object.entries(paymentData).forEach(([key, value]) => {
        if (value.trim() === '') {
            errors =  key + " is required";
            successfulCheckout(errors);
            }
        });

        if(paymentData.cvc.length !== 3) {
            errors = 'Invalid CVC';
        }

        if(paymentData.cardNumber.trim().replace(/\s/g, '').length !== 16) {
            errors = 'Invalid card number';
        }

        if(totalCost <= 0){
            errors = 'No product in cart';
        }
        if(errors === '' && totalCost!==0){
            successfulCheckout('');
        }

    }

    return (
        <div>
        <h1>Payment: ${totalCost}</h1>
        <img className="VisaCardSample" src={VisaCardSample} />
        <form onSubmit={handleSubmit}>
            <div className='payment-Form'>
            <div className='CardHolderName'>
                <label>
                    Cardholder Name:
                    <br/>
                    <input
                        name="name"
                        type="name"
                        value={paymentData.name}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className='CardNumber'>
                <label>
                    Card Number:
                    <br/>
                    <input
                        name="cardNumber"
                        type="string"
                        value={paymentData.cardNumber}
                        placeholder='0000 0000 0000 0000'
                        maxLength={19}
                        onChange={handleCardNumber}
                    />
                </label>
            </div>
            <div className="Expiry-div">
                    <label>
                        Expiry Year:
                        <br/>
                        <input
                            name="expiryYear"
                            type="text"
                            className="Expiry-year-input"
                            value={paymentData.expiryYear}
                            maxLength={4}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Expiry Month:
                        <br/>
                        <select 
                            name="expiryMonth"
                            type="text"
                            className="Expiry-month-input"
                            value={paymentData.expiryMonth}
                            onChange={handleChange}
                            >
                            <option value="January">January</option>
                            <option value="Feburary">Feburary</option>
                            <option value="March">March</option>
                            <option value="April">April</option>
                            <option value="May">May</option>
                            <option value="June">June</option>
                            <option value="July">July</option>
                            <option value="August">August</option>
                            <option value="September">September</option>
                            <option value="October">October</option>
                            <option value="November">November</option>
                            <option value="December">December</option>
                        </select>
                    </label>
            </div>
            <div>
                <label>
                    Cvc:
                    <br/>
                    <input
                        name="cvc"
                        type="text"
                        className="cvc-input"
                        value={paymentData.cvc}
                        onChange={handleChange}
                        maxLength={3}
                    />
                </label>
            </div>
            </div>
            <br/>
            <br/>
            <div className='Button-div'>
                <button type="button" onClick={() => {unSuccessfulCheckout()}}>Cancel</button>
                <button type="submit">Ok</button>
            </div>
            
        </form>
        </div>
    )
}

export default Payment
