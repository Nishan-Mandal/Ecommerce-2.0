const order = {
  // Identity
  orderId: "",
  userId: "",
  // Products Purchased (Snapshot)
  products: [
    {
      productId: "",
      variantId: "",

      // Product Snapshot
      productName: "",
      productSlug: "",
      productImage: "",

      // Variant Snapshot
      variantName: "",
      sku: "",

      // Selected Options
      options: {
        color: "",
        size: "",
        material: "",
      },

      quantity: 1,

      // Pricing Snapshot
      originalPrice: 0,
      sellingPrice: 0,
      discount: 0,

      totalPrice: 0,
    },
  ],
  // Pricing Summary
  pricing: {
    subtotal: 0,
    productDiscount: 0,
    couponDiscount: 0,
    shippingCharge: 0,
    tax: 0,
    grandTotal: 0,
  },
  // Coupon
  coupon: {
    couponId: null,
    code: null,
    discount: 0,
  },
  createdAt: null,
  updatedAt: null,


// Will be added for advance Ecoomerce website 

  // Shipping Address Snapshot
  shippingAddress: {
    fullName: "",
    phone: "",
    houseNo: "",
    buildingName: "",
    street: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    landmark: "",
  },

  // Payment
  payment: {
    paymentId: "",
    method: "ONLINE", // ONLINE | COD
    gateway: "RAZORPAY", // RAZORPAY | STRIPE | CASH
    status: "PENDING", // PENDING | SUCCESS | FAILED | REFUNDED
  },

  // Order Status
  orderStatus: "PLACED",
  // PLACED, CONFIRMED, PACKED,SHIPPED,OUT_FOR_DELIVERY,DELIVERED,CANCELLED,RETURN_REQUESTED, RETURNED,REFUNDED

  // Tracking
  tracking: {
    courier: "",
    trackingId: "",
    trackingUrl: "",
  },

  // Notes
  customerNote: "",
  adminNote: "",

  // Timestamps
  deliveredAt: null,
  cancelledAt: null,
};