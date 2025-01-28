import React, { ChangeEvent, useEffect, useState } from 'react';
import './App.css';

interface FormData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  email: string;
  cvv: string;
  amount: string;
  currency: "USD" | "EUR" | "GBP" | "RUB"; // Ограничиваем выбор валют
}

function App() {

  const [successful, setSuccessful] = useState<boolean>(false);

  const [errors, setErrors] = useState<string[]>([]);

  const formInitial: FormData = {
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    email: "",
    cvv: "",
    amount: "",
    currency: "EUR",
  };

  const [formData, setFormData] = useState<FormData>(formInitial);

  useEffect(() => {
    setFormData(formInitial)
  }, [successful]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (e) => {
    let { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setSuccessful(false);
    const body = JSON.stringify({
      client: {
        email: formData.email,
        screen_height: window.screen.height,
        screen_width: window.screen.width,
        language: navigator.language,
        utc_offset: new Date().getTimezoneOffset(),
        success_route: 'success',
        failed_route: 'failed',
      },
      card: {
        card_number: formData.cardNumber,
        expires: formData.expiryDate,
        cardholder_name: formData.cardHolder,
        cvc: formData.cvv,
      },
      amount: Math.floor(parseFloat(formData.amount) * 100),
      currency: formData.currency,
    });

    fetch('/api/v1/purchase', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body,
    }).then((r ) => r.json()).then((r) => {
      if (r.statusCode === 400 && Array.isArray(r.message)) {
        const set = new Set<string>(r.message);
        const errors: string[] = [];
        set.forEach((error) => {
          errors.push(error.split('.').pop() as string);
        });
        setErrors(errors);
      } else if (r.statusCode >= 500) {
        setErrors(['Something went wrong with payment service']);
      } else {
        setSuccessful(true);
      }
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Simple donation form
        </p>
      </header>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }} hidden={successful}>

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@doe.com"
            required
          />
        </div>

        <div>
          <label>Card Number:</label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>

        <div>
          <label>Card Holder:</label>
          <input
            type="text"
            name="cardHolder"
            value={formData.cardHolder}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label>Expiry Date:</label>
          <input
            type="text"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            placeholder="MM/YY"
            required
          />
        </div>

        <div>
          <label>CVV:</label>
          <input
            type="password"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            placeholder="123"
            required
          />
        </div>

        <div>
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            required
          />
        </div>

        <div>
          <label>Currency:</label>
          <select name="currency" value={formData.currency} onChange={handleChange}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="RUB">RUB</option>
          </select>
        </div>

        <div className={"errors"}>

          {errors.map((error) => (
            <div key={error}>{error}</div>
          ))}

        </div>

        <button type="submit" style={{ marginTop: "20px" }}>
          Pay Now
        </button>
      </form>

      <div className={"success"} hidden={!successful}>

        Payment successful

        <button onClick={() => setSuccessful(false)}>New Payment</button>

      </div>
    </div>
  );
}

export default App;
