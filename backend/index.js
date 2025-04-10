const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const twilio = require("twilio");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
app.post("/send-order-confirmation", async (req, res) => {
    let { phoneNumber, orderId, total } = req.body;
  
    // Add +91 if not already present
    if (!phoneNumber.startsWith("+")) {
      phoneNumber = `+91${phoneNumber}`;
    }
  
    // Validate the resulting number
    const isValidPhoneNumber = /^\+\d{10,15}$/.test(phoneNumber);
    if (!isValidPhoneNumber) {
      return res.status(400).json({
        success: false,
        error: "Invalid phone number after adding country code.",
      });
    }
  
    if (!orderId) {
      return res.status(400).json({ success: false, error: "Missing order ID." });
    }
  
    try {
      const message = await client.messages.create({
        body: `Warm greetings from LaundriLite. Your order #${orderId?.slice(-6)} has been placed successfully.Total Amount:${total} Thank you for using our service!`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });
  
      console.log("✅ SMS sent:", message.sid);
      res.json({ success: true, sid: message.sid });
    } catch (error) {
      console.error("❌ SMS Error:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
