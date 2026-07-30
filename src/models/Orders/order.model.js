/**
 * Order Model Schema
 * Created inside Webhook transaction upon successful payment confirmation.
 */
const order = {
  // Identity
  orderId: "",
  userId: "",

  // Products Purchased (Immutable Snapshot)
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

  // Shipping Address Snapshot (Immutable)
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
    type: "HOME",
  },

  // Pricing Breakdown Summary
  pricing: {
    subtotal: 0,
    productDiscount: 0,
    couponDiscount: 0,
    shippingCharge: 0,
    grandTotal: 0,
  },

  // Immutable Coupon Snapshot
  coupon: {
    couponId: null,
    code: null,
    discount: 0,
  },

  // Payment Reference
  payment: {
    paymentId: "",
    gateway: "RAZORPAY",
    gatewayPaymentId: "",
    method: "UPI",
    status: "SUCCESS",
  },

  // Order Status & Historical Audit Trail
  orderStatus: "PLACED",
  // PLACED | CONFIRMED | PACKED | SHIPPED | OUT_FOR_DELIVERY | DELIVERED | CANCELLED | RETURN_REQUESTED | RETURNED | REFUNDED
  statusHistory: [
    {
      status: "PLACED",
      updatedBy: "SYSTEM_WEBHOOK",
      timestamp: null,
    },
  ],

  // Logistics Tracking
  tracking: {
    courier: "",
    trackingId: "",
    trackingUrl: "",
  },

  // Customer & Admin Notes
  customerNote: "",
  adminNote: "",

  // Timestamps
  createdAt: null,
  updatedAt: null,
  deliveredAt: null,
  cancelledAt: null,
};

export default order;