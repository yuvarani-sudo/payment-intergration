const express = require("express");
const cors = require("cors");
const razorpay = require("razorpay");
const crypto = require("crypto");

require("dotenv").config();

const app = express();

const rzp = new razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET
});


app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, () => {
   console.log(`Server is running on port ${process.env.PORT}`);
});
// crete order api
app.post("/create-order", async(req, res) => {
    try {
        const options = {
            amount: 100, // it takes $ 1 rupees = 100 paisa
            currency: "INR",
            receipt: "rcpt_id_11"
        }
        const order = await rzp.orders.create(options);
        console.log("order", order);
        res.status(200).json(order);
    } catch(err) {
            console.log(err);
            res.status(500).send(err)
    }
});

// verify payment api

app.post("/verify-payment", (req, res)=> {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
const expectedSignature = crypto
    .createHmac("sha256", process.env.KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    res.json({ status: "success" });
  } else {
    res.status(400).json({ status: "failed" });
  }

});

