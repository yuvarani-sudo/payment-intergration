
function App() {

  const handlePayment = async () => {
    try {
      // 1. Call backend to create order
      const res = await fetch("http://localhost:5000/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: 50000 // ₹500
        })
      });

      const data = await res.json();

      // 2. Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: data.amount,
        currency: "INR",
        name: "Yuvarani Store",
        description: "Test Payment",
        order_id: data.id,

        method: {
          upi: true // GPay, PhonePe
        },

        handler: async function (response) {
          // 3. Verify payment
          const verifyRes = await fetch("http://localhost:5000/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(response)
          });

          const result = await verifyRes.json();

          if (result.success) {
            alert("Payment Successful ✅");
          } else {
            alert("Payment Failed ❌");
          }
        },

        prefill: {
          name: "Yuvarani",
          email: "test@gmail.com",
          contact: "9999999999"
        },

        theme: {
          color: "#3399cc"
        }
      };

      // 4. Open Razorpay popup
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error(error);
      alert("Error in payment");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Pay ₹500</h2>
      <button
        onClick={handlePayment}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#3399cc",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Pay with GPay / UPI
      </button>
    </div>
  );
}

export default App;