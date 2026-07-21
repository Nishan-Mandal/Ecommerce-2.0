import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import serviceAccount from "../../firebase/serviceAccountKey.json" with { type: "json" };

const serverTimestamp = () => FieldValue.serverTimestamp();

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const ratings = [
  // Custom Handmade Portrait
  {
    productId: "8dYvooLwMdFWBPcJx0if",
    userId: "USER001",
    userName: "Rahul Sharma",
    rating: 5,
    review: "Absolutely loved the portrait. The detailing was amazing!",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    productId: "8dYvooLwMdFWBPcJx0if",
    userId: "USER002",
    userName: "Priya Singh",
    rating: 4,
    review: "Beautiful artwork and delivered on time.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },

  // Handmade Portrait
  {
    productId: "M7QWXwmZokPONdjIGSX",
    userId: "USER003",
    userName: "Ankit Verma",
    rating: 5,
    review: "Worth every penny. Highly recommended!",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },

  // Family Portrait
  {
    productId: "cMK5Z20YfwtRYAyrzgk3",
    userId: "USER004",
    userName: "Sneha Roy",
    rating: 5,
    review: "Perfect gift for my parents.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },

  // Couple Portrait
  {
    productId: "gxN15iPaalo5Cicf6l6w",
    userId: "USER005",
    userName: "Aman Gupta",
    rating: 4,
    review: "Very good quality and beautiful finishing.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },

  {
    productId: "gxN15iPaalo5Cicf6l6w",
    userId: "USER006",
    userName: "Neha Kapoor",
    rating: 5,
    review: "My partner loved it. Thank you!",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },

  // Samsung Galaxy S24 Ultra
  {
    productId: "tMkOjNSsui8502xZ1ubf",
    userId: "USER007",
    userName: "Rohit Das",
    rating: 5,
    review: "Amazing camera and battery life.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },

  {
    productId: "tMkOjNSsui8502xZ1ubf",
    userId: "USER008",
    userName: "Karan Patel",
    rating: 4,
    review: "Excellent phone but slightly expensive.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },

  // LG AC
  {
    productId: "DI4as1BzupWrP50nsCCG",
    userId: "USER009",
    userName: "Pooja Sharma",
    rating: 5,
    review: "Cools the room very quickly.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },

  // iPhone 16
  {
    productId: "fsA2Vx9MOc8mjLOdeTOL",
    userId: "USER010",
    userName: "Arjun Mehta",
    rating: 5,
    review: "Smooth performance and premium feel.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },

  {
    productId: "fsA2Vx9MOc8mjLOdeTOL",
    userId: "USER011",
    userName: "Riya Jain",
    rating: 4,
    review: "Excellent phone, battery could be better.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },

  // Sony Headphones
  {
    productId: "PRODUCT_ID_7",
    userId: "USER012",
    userName: "Sahil Kumar",
    rating: 5,
    review: "Best noise cancelling headphones I've ever used.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },

  // MacBook Air M3
  {
    productId: "D1gmkVNXxnyJwC4CV8Kk",
    userId: "USER013",
    userName: "Nitin Agarwal",
    rating: 5,
    review: "Super fast and lightweight laptop.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },

  {
    productId: "D1gmkVNXxnyJwC4CV8Kk",
    userId: "USER014",
    userName: "Komal Sinha",
    rating: 5,
    review: "Battery lasts all day. Love it.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },

  // Village Portrait
  {
    productId: "PRODUCT_ID_10",
    userId: "USER015",
    userName: "Abhishek Paul",
    rating: 4,
    review: "Beautiful handcrafted artwork.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },

  // Dell XPS 15
  {
    productId: "ILuf4keolEVju0VU7vJj",
    userId: "USER016",
    userName: "Vikas Sharma",
    rating: 5,
    review: "Perfect laptop for development and design.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },

  // LG TV
  {
    productId: "abwEfuwfdXvOsTRdRhV1",
    userId: "USER017",
    userName: "Harsh Yadav",
    rating: 4,
    review: "Picture quality is excellent.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },

  {
    productId: "abwEfuwfdXvOsTRdRhV1",
    userId: "USER018",
    userName: "Megha Nair",
    rating: 5,
    review: "Great value for money and easy to set up.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }
];


async function createRatingCollection() {
  try {
    // 1. Get all products to build a title-to-ID lookup map
    const productsSnapshot = await db.collection("products").get();
    const productTitleToId = {};
    productsSnapshot.forEach(doc => {
      productTitleToId[doc.data().title.toLowerCase().trim()] = doc.id;
    });

    // 2. Define mapping from hardcoded product ID in ratings array to their product titles
    const ratingIdToTitle = {
      "8dYvooLwMdFWBPcJx0if": "custom handmade portrait",
      "M7QWXwmZokPONdjIGSX": "handmade portrait",
      "cMK5Z20YfwtRYAyrzgk3": "family portrait",
      "gxN15iPaalo5Cicf6l6w": "couple portrait",
      "tMkOjNSsui8502xZ1ubf": "samsung galaxy s24 ultra",
      "DI4as1BzupWrP50nsCCG": "lg 1.5 ton dual inverter split air conditioner",
      "fsA2Vx9MOc8mjLOdeTOL": "apple iphone 16",
      "PRODUCT_ID_7": "sony wh-1000xm5 wireless headphones",
      "D1gmkVNXxnyJwC4CV8Kk": "macbook air m3",
      "PRODUCT_ID_10": "premium handmade village portrait",
      "ILuf4keolEVju0VU7vJj": "dell xps 15",
      "abwEfuwfdXvOsTRdRhV1": "lg 43-inch uhd ai thinq smart led tv"
    };

    // 3. Delete all existing ratings to prevent duplicates
    const snapshot = await db.collection("ratings").get();
    const deleteBatch = db.batch();
    snapshot.forEach((doc) => {
      deleteBatch.delete(doc.ref);
    });
    await deleteBatch.commit();
    console.log(" Cleaned up old ratings from collection.");

    // 4. Upload new ratings
    const batch = db.batch();

    ratings.forEach((rating) => {
      const ref = db.collection("ratings").doc(); // Auto-generates a document ID
      const title = ratingIdToTitle[rating.productId];
      const actualProductId = title ? productTitleToId[title.toLowerCase().trim()] : rating.productId;

      const docData = {
        ...rating,
        id: ref.id,
        productId: actualProductId || rating.productId
      };

      batch.set(ref, docData);
    });

    await batch.commit();
    console.log(` Successfully uploaded ${ratings.length} ratings.`);
  } catch (err) {
    console.error(" Error:", err);
  }
}

createRatingCollection();