import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "../../firebase/serviceAccountKey.json" with { type: "json" };

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

export const products = [
  {
    brand: "HandCraft Studio",
    title: "Custom Handmade Portrait",
    description:
      "Dive into our world of handmade portraits, where every brushstroke tells your unique story.",
    category: "Custom",
    tags: ["Portrait", "Handmade", "Custom"],
    images: ["https://www.lg.com/content/dam/channel/wcms/in/images/split-ac/gallery/updated-1-2-gallery/US-Q19MWZE-2010X1334.jpg/jcr:content/renditions/thum-1600x1062.jpeg"],
    variantTypes: [
      {
        name: "Size",
        values: ["A4", "A3", "A2"]
      },
      {
        name: "Frame",
        values: ["Without Frame", "Black Frame", "Wooden Frame"]
      }
    ],
    variants: [
      {
        attributes: { Size: "A4", Frame: "Without Frame" },
        price: 499,
        originalPrice: 599,
        inStock: 20,
        isActive: true,
        images: []
      },
      {
        attributes: { Size: "A3", Frame: "Wooden Frame" },
        price: 899,
        originalPrice: 999,
        inStock: 12,
        isActive: true,
        images: []
      }
    ]
  },

  {
    brand: "HandCraft Studio",
    title: "Handmade Portrait",
    description:
      "Beautiful handmade artwork that captures your memories forever.",
    category: "Custom",
    tags: ["Portrait", "Gift"],
    images: ["https://www.lg.com/content/dam/channel/wcms/in/images/split-ac/gallery/updated-1-2-gallery/US-Q19MWZE-2010X1334.jpg/jcr:content/renditions/thum-1600x1062.jpeg"],
    variantTypes: [
      {
        name: "Size",
        values: ["A4", "A3"]
      }
    ],
    variants: [
      {
        attributes: { Size: "A4" },
        price: 499,
        originalPrice: 599,
        inStock: 15,
        isActive: true,
        images: []
      }
    ]
  },

  {
    brand: "HandCraft Studio",
    title: "Family Portrait",
    description:
      "Handmade family portrait created from your favorite photograph.",
    category: "Custom",
    tags: ["Family", "Portrait"],
    images: ["https://firebasestorage.googleapis.com/v0/b/e-commerce-d6aae.appspot.com/o/Products%2Ffamily_portrait.jpg?alt=media"],
    variantTypes: [
      {
        name: "Size",
        values: ["A4", "A3"]
      }
    ],
    variants: [
      {
        attributes: { Size: "A4" },
        price: 799,
        originalPrice: 999,
        inStock: 10,
        isActive: true,
        images: []
      }
    ]
  },

  {
    brand: "HandCraft Studio",
    title: "Couple Portrait",
    description:
      "A personalized handmade couple portrait perfect for gifting.",
    category: "Custom",
    tags: ["Couple", "Anniversary"],
    images: ["https://firebasestorage.googleapis.com/v0/b/e-commerce-d6aae.appspot.com/o/Products%2Fcouple_portrait.jpg?alt=media"],
    variantTypes: [
      {
        name: "Size",
        values: ["A4", "A3"]
      }
    ],
    variants: [
      {
        attributes: { Size: "A3" },
        price: 999,
        originalPrice: 1399,
        inStock: 8,
        isActive: true,
        images: []
      }
    ]
  },

  {
    brand: "Samsung",
    title: "Samsung Galaxy S24 Ultra",
    description:
      "Premium Android flagship smartphone with AI-powered features.",
    category: "ReadyMade",
    tags: ["Samsung", "Mobile", "5G"],
    images: ["https://www.lg.com/content/dam/channel/wcms/in/images/split-ac/gallery/updated-1-2-gallery/US-Q19MWZE-2010X1334.jpg/jcr:content/renditions/thum-1600x1062.jpeg"],
    variantTypes: [
      {
        name: "Color",
        values: ["Black", "Titanium"]
      },
      {
        name: "Storage",
        values: ["256 GB", "512 GB"]
      }
    ],
    variants: [
      {
        attributes: { Color: "Black", Storage: "256 GB" },
        price: 99999,
        originalPrice: 120000,
        inStock: 18,
        isActive: true,
        images: []
      },
      {
        attributes: { Color: "Titanium", Storage: "512 GB" },
        price: 109999,
        originalPrice: 120000,
        inStock: 10,
        isActive: true,
        images: []
      }
    ]
  },

  {
    brand: "LG",
    title: "LG 1.5 Ton Dual Inverter Split Air Conditioner",
    description:
      "Energy-efficient inverter AC with fast cooling technology.",
    category: "ReadyMade",
    tags: ["LG", "AC", "Home Appliance"],
    images: ["https://firebasestorage.googleapis.com/v0/b/e-commerce-d6aae.appspot.com/o/Products%2Flg_ac.jpg?alt=media"],
    variantTypes: [
      {
        name: "Capacity",
        values: ["1.5 Ton"]
      }
    ],
    variants: [
      {
        attributes: { Capacity: "1.5 Ton" },
        price: 38999,
        originalPrice: 45999,
        inStock: 6,
        isActive: true,
        images: []
      }
    ]
  },

  {
    brand: "Apple",
    title: "Apple iPhone 16",
    description:
      "Powerful iPhone featuring the latest Apple A18 processor.",
    category: "ReadyMade",
    tags: ["Apple", "iPhone", "5G"],
    images: ["https://firebasestorage.googleapis.com/v0/b/e-commerce-d6aae.appspot.com/o/Products%2Fiphone16.jpg?alt=media"],
    variantTypes: [
      {
        name: "Color",
        values: ["Blue", "Black"]
      },
      {
        name: "Storage",
        values: ["128 GB", "256 GB"]
      }
    ],
    variants: [
      {
        attributes: { Color: "Blue", Storage: "128 GB" },
        price: 79999,
        originalPrice: 89999,
        inStock: 20,
        isActive: true,
        images: []
      }
    ]
  },

  {
    brand: "Sony",
    title: "Sony WH-1000XM5 Wireless Headphones",
    description:
      "Industry-leading wireless noise cancelling headphones.",
    category: "ReadyMade",
    tags: ["Sony", "Headphones"],
    images: ["https://firebasestorage.googleapis.com/v0/b/e-commerce-d6aae.appspot.com/o/Products%2Fsony_xm5.jpg?alt=media"],
    variantTypes: [
      {
        name: "Color",
        values: ["Black", "Silver"]
      }
    ],
    variants: [
      {
        attributes: { Color: "Black" },
        price: 27999,
        originalPrice: 35999,
        inStock: 15,
        isActive: true,
        images: []
      }
    ]
  },

  {
    brand: "Apple",
    title: "MacBook Air M3",
    description:
      "Ultra-thin laptop powered by Apple's M3 chip.",
    category: "ReadyMade-Premium",
    tags: ["Laptop", "Apple"],
    images: ["https://firebasestorage.googleapis.com/v0/b/e-commerce-d6aae.appspot.com/o/Products%2Fmacbook_m3.jpg?alt=media"],
    variantTypes: [
      {
        name: "Storage",
        values: ["512 GB", "1 TB"]
      }
    ],
    variants: [
      {
        attributes: { Storage: "512 GB" },
        price: 139999,
        originalPrice: 159999,
        inStock: 7,
        isActive: true,
        images: []
      }
    ]
  },

  {
    brand: "HandCraft Studio",
    title: "Premium Handmade Village Portrait",
    description:
      "A premium handcrafted portrait inspired by timeless village life.",
    category: "ReadyMade-Premium",
    tags: ["Premium", "Portrait"],
    images: ["https://firebasestorage.googleapis.com/v0/b/e-commerce-d6aae.appspot.com/o/Products%2Fvillage_portrait.jpg?alt=media"],
    variantTypes: [
      {
        name: "Size",
        values: ["A3", "A2"]
      }
    ],
    variants: [
      {
        attributes: { Size: "A2" },
        price: 2799,
        originalPrice: 4599,
        inStock: 8,
        isActive: true,
        images: []
      }
    ]
  },

  {
    brand: "Dell",
    title: "Dell XPS 15",
    description:
      "Premium Windows laptop for professionals and creators.",
    category: "ReadyMade-Premium",
    tags: ["Dell", "Laptop"],
    images: ["https://firebasestorage.googleapis.com/v0/b/e-commerce-d6aae.appspot.com/o/Products%2Fdell_xps.jpg?alt=media"],
    variantTypes: [
      {
        name: "RAM",
        values: ["16 GB", "32 GB"]
      }
    ],
    variants: [
      {
        attributes: { RAM: "32 GB" },
        price: 189999,
        originalPrice: 195999,
        inStock: 5,
        isActive: true,
        images: []
      }
    ]
  },

  {
    brand: "LG",
    title: "LG 43-inch UHD AI ThinQ Smart LED TV",
    description:
      "43-inch 4K UHD Smart TV with AI ThinQ and webOS.",
    category: "ReadyMade-Premium",
    tags: ["LG", "TV", "4K"],
    images: ["https://firebasestorage.googleapis.com/v0/b/e-commerce-d6aae.appspot.com/o/Products%2Flg_tv.jpg?alt=media"],
    variantTypes: [
      {
        name: "Size",
        values: ["43 Inch"]
      }
    ],
    variants: [
      {
        attributes: { Size: "43 Inch" },
        price: 45999,
        originalPrice: 55999,
        inStock: 12,
        isActive: true,
        images: []
      }
    ]
  },

  {
    brand: "Sony",
    title: "Sony Bravia 65-inch 4K Ultra HD Google TV",
    description:
      "Premium 65-inch Google TV with Dolby Vision and Dolby Atmos.",
    category: "ReadyMade-Premium",
    tags: ["Sony", "TV", "4K"],
    images: ["https://firebasestorage.googleapis.com/v0/b/e-commerce-d6aae.appspot.com/o/Products%2Fsony_tv.jpg?alt=media"],
    variantTypes: [
      {
        name: "Size",
        values: ["65 Inch"]
      }
    ],
    variants: [
      {
        attributes: { Size: "65 Inch" },
        price: 89999,
        originalPrice: 105999,
        inStock: 6,
        isActive: true,
        images: []
      }
    ]
  }
];

async function createProductsCollection() {
  try {
    // 1. Delete all existing products to prevent duplicates and clean up docs missing 'time'
    const snapshot = await db.collection("products").get();
    const deleteBatch = db.batch();
    snapshot.forEach((doc) => {
      deleteBatch.delete(doc.ref);
    });
    await deleteBatch.commit();
    console.log(" Cleaned up old products from collection.");

    // 2. Upload new products with required 'time' and 'date' fields
    const batch = db.batch();

    products.forEach((prod) => {
      const ref = db.collection("products").doc(); // Auto-generates a document ID
      const docData = {
        ...prod,
        id: ref.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      batch.set(ref, docData);
    });

    await batch.commit();
    console.log(` Successfully uploaded ${products.length} products.`);
  } catch (err) {
    console.error(" Error:", err);
  }
}

createProductsCollection();