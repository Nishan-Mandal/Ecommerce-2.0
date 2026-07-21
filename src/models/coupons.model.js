const coupon = {
  // Identity
  couponId: "",
  code: "",

  // Discount
  type: "PERCENTAGE", // PERCENTAGE | FIXED
  discountValue: 0,

  // Conditions
  minimumOrderAmount: 0,
  maximumDiscountAmount: null, // Only for percentage coupons

  // Usage
  usageLimit: 100,          // Total uses allowed
  currentUsage: 0,
  usagePerUser: 1,          // Max uses per user

  // Validity
  validFrom: null,
  validUntil: null,

  // Scope
  appliesTo: "ALL", // ALL | PRODUCT | CATEGORY

  applicableProducts: [],   // ["productId1", "productId2"]
  applicableCategories: [], // ["categoryId1"]

  // Status
  isActive: true,

  // Metadata
  createdBy: "", // Admin UID
  createdAt: null,
  updatedAt: null,
};