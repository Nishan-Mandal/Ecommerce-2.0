// Updated Product Schema 
// const products={
//   "productId": "PROD_001",
//   "brand": "Apple",
//   "title": "iPhone 16 Pro",
//   "description": "Latest Apple flagship smartphone",
//   "category": "Mobiles",
//   "tags": [
//     "Apple",
//     "5G"
//   ],
//   "images": [
//     "product1.jpg",
//     "product2.jpg"
//   ],

//   "hasVariants": true,

//   // Used only when hasVariants = false
//   "price": null,
//   "originalPrice": null,
//   "inStock": null,

//   // Used only when hasVariants = true
//   "variantTypes": [
//     {
//       "name": "Color",
//       "values": [
//         "Black",
//         "White"
//       ]
//     },
//     {
//       "name": "Storage",
//       "values": [
//         "128 GB",
//         "256 GB"
//       ]
//     }
//   ],

//   "variants": [
//     {
//       "variantId": "VAR_001",
//       "attributes": {
//         "Color": "Black",
//         "Storage": "128 GB"
//       },
//       "price": 1299,
//       "originalPrice": 1599,
//       "inStock": 20,
//       "images": [
//         "black128-1.jpg"
//       ]
//     },
//     {
//       "variantId": "VAR_002",
//       "attributes": {
//         "Color": "Black",
//         "Storage": "256 GB"
//       },
//       "price": 1399,
//       "originalPrice": 1599,
//       "inStock": 15,
//       "images": [
//         "black256-1.jpg"
//       ]
//     }
//   ],

//   "createdAt": "Timestamp",
//   "updatedAt": "Timestamp"
// }


// const product={
//   "productId": "PROD_001",
//   "brand": "Apple",
//   "title": "iPhone 16 Pro",
//   "description": "Latest Apple flagship smartphone",
//   "category": "Mobiles",
//   "tags": [
//     "Apple",
//     "5G"
//   ],
//   "images": [
//     "product1.jpg",
//     "product2.jpg"
//   ],
//   "variantTypes": [
//     {
//       "name": "Color",
//       "values": [
//         "Black",
//         "White"
//       ]
//     },
//     {
//       "name": "Storage",
//       "values": [
//         "128 GB",
//         "256 GB"
//       ]
//     }
//   ],
//   "variants": [
//     {
//       "variantId": "VAR_001",
//       "attributes": {
//         "Color": "Black",
//         "Storage": "128 GB"
//       },
//       "price": 1299,
//       "originalPrice": 1599,
//       "inStock": 20,  
//       "images": [
//         "black128-1.jpg"
//       ]
//     },
//     {
//       "variantId": "VAR_002",
//       "attributes": {
//         "Color": "Black",
//         "Storage": "256 GB"
//       },
//       "price": 1399,
//       "inStock": 15,
//       "images": [
//         "black256-1.jpg"
//       ]
//     },
//     {
//       "variantId": "VAR_003",
//       "attributes": {
//         "Color": "White",
//         "Storage": "128 GB"
//       },
//       "price": 1299,
//       "inStock": 18,
//       "images": [
//         "white128-1.jpg"
//       ]
//     },
//     {
//       "variantId": "VAR_004",
//       "attributes": {
//         "Color": "White",
//         "Storage": "256 GB"
//       },
//       "price": 1399,
//       "inStock": 12,
//       "images": [
//         "white256-1.jpg"
//       ]
//     }
//   ],
  
//   "createdAt": "Timestamp",
//   "updatedAt": "Timestamp"
// }




{
  "productId": "PROD_001",
  "brand": "Apple",
  "title": "iPhone 16 Pro",

  "description": {
    "short": "Latest Apple flagship smartphone",

    "sections": [
      {
        "id": "SEC_001",
        "type": "TEXT",
        "title": "Overview",
        "content": "The iPhone 16 Pro is Apple's latest flagship featuring the A18 Pro chip, titanium body, improved cameras, and Apple Intelligence."
      },

      {
        "id": "SEC_002",
        "type": "TEXT",
        "title": "Features",
        "content": "Supports 5G, Wi-Fi 7, USB-C, Face ID, MagSafe, and fast wireless charging."
      },

      {
        "id": "SEC_003",
        "type": "TABLE",
        "title": "Specifications",

        "columns": [
          "Feature",
          "Value"
        ],

        "rows": [
          ["Display", "6.3-inch Super Retina XDR OLED"],
          ["Processor", "Apple A18 Pro"],
          ["RAM", "8 GB"],
          ["Storage", "128 GB / 256 GB / 512 GB"],
          ["Battery", "3582 mAh"],
          ["Operating System", "iOS 26"]
        ]
      },

      {
        "id": "SEC_004",
        "type": "TABLE",
        "title": "In the Box",

        "columns": [
          "Item",
          "Quantity"
        ],

        "rows": [
          ["iPhone 16 Pro", "1"],
          ["USB-C Cable", "1"],
          ["Documentation", "1"]
        ]
      }
    ]
  },

  "category": "Mobiles",

  "tags": [
    "Apple",
    "5G"
  ],

  "images": [
    "product1.jpg",
    "product2.jpg"
  ],

  "hasVariants": true,

  "price": null,
  "originalPrice": null,
  "inStock": null,

  "variantTypes": [
    {
      "name": "Color",
      "values": [
        "Black",
        "White"
      ]
    },
    {
      "name": "Storage",
      "values": [
        "128 GB",
        "256 GB"
      ]
    }
  ],

  "variants": [
    {
      "variantId": "VAR_001",

      "attributes": {
        "Color": "Black",
        "Storage": "128 GB"
      },

      "price": 1299,
      "originalPrice": 1599,
      "inStock": 20,

      "images": [
        "black128-1.jpg"
      ]
    },

    {
      "variantId": "VAR_002",

      "attributes": {
        "Color": "Black",
        "Storage": "256 GB"
      },

      "price": 1399,
      "originalPrice": 1599,
      "inStock": 15,

      "images": [
        "black256-1.jpg"
      ]
    }
  ],

  "createdAt": "Timestamp",
  "updatedAt": "Timestamp"
}