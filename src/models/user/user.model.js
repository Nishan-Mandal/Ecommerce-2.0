const user = {
  userId: "", 
  username: "",
  email: "",
  phone: "",
  profileImage: "",

  // Role
  role: "USER", // USER | ADMIN | SUPERADMIN

  // Account Status
  isActive: true,
  emailVerified: false,
  phoneVerified: false,

  // Quick Access
  defaultAddressId: null,

  // Statistics
  totalOrders: 0,
  totalReviews: 0,
  wishlistCount: 0,
  cartItemsCount: 0,
  totalSpent: 0,

  // Metadata
  createdAt: null,
  updatedAt: null,
  lastLogin: null,
};