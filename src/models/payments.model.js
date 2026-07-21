const payment = {
  // Identity
  paymentId: "", // Document ID (or Razorpay Payment ID)
  orderId: "",
  userId: "",
  // Payment Provider
  gateway: "RAZORPAY", // RAZORPAY | STRIPE | CASH
  method: "UPI",        // UPI | CARD | NETBANKING | WALLET | EMI | COD | CASH
  // Gateway References
  gatewayOrderId: "",        // Razorpay Order ID
  gatewayPaymentId: "",      // Razorpay Payment ID
  gatewaySignature: "",      // Razorpay Signature
  // Amounts
  currency: "INR",
  amount: {
    subtotal: 0,
    couponDiscount: 0,
    shippingCharge: 0,
    grandTotal: 0,
  },
  // Coupon Used
  coupon: {
    couponId: null,
    code: null,
  },
  // Status
  status: "PENDING",
  // Refund (if any)
  refund: {
    refundId: null,
    amount: 0,
    reason: "",
    status: null,
    refundedAt: null,
  },

  // Metadata
  createdAt: null,
  updatedAt: null,
};