// Product Data
const products = [
  // Socks
  {
    id: 1,
    name: "Premium Cotton Socks",
    price: 12.99,
    originalPrice: 18.99,
    image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=300&h=300&fit=crop",
    category: "socks",
    rating: 4.8,
    reviews: 124,
    colors: ["Black", "White", "Gray"],
    sizes: ["S", "M", "L"],
    description:
      "Experience ultimate comfort with our premium cotton socks. Made from 100% organic cotton, these socks provide breathability, moisture-wicking properties, and long-lasting durability.",
    features: [
      "100% Organic Cotton",
      "Moisture-wicking technology",
      "Reinforced heel and toe",
      "Seamless toe construction",
      "Machine washable",
    ],
    inStock: true,
    isFlashSale: true,
  },
  {
    id: 2,
    name: "Wool Hiking Socks",
    price: 16.99,
    originalPrice: 22.99,
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=300&fit=crop",
    category: "socks",
    rating: 4.7,
    reviews: 89,
    colors: ["Brown", "Green", "Blue"],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Perfect for outdoor adventures, our wool hiking socks provide exceptional warmth, cushioning, and moisture control to keep your feet comfortable on any trail.",
    features: [
      "Merino wool blend",
      "Extra cushioning in high-impact areas",
      "Arch support",
      "Odor-resistant",
      "Quick-drying",
    ],
    inStock: true,
    isFlashSale: false,
  },
  {
    id: 3,
    name: "Athletic Performance Socks",
    price: 14.99,
    originalPrice: 19.99,
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop",
    category: "socks",
    rating: 4.9,
    reviews: 156,
    colors: ["Black", "White", "Red"],
    sizes: ["S", "M", "L"],
    description:
      "Engineered for athletes, these performance socks feature targeted compression, ventilation zones, and impact protection to enhance your workout experience.",
    features: [
      "Targeted compression",
      "Ventilation mesh panels",
      "Blister prevention",
      "Reflective elements",
      "Anatomical left/right design",
    ],
    inStock: true,
    isFlashSale: true,
  },

  // Shoes
  {
    id: 4,
    name: "Running Sneakers",
    price: 89.99,
    originalPrice: 120.0,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
    category: "shoes",
    rating: 4.9,
    reviews: 89,
    colors: ["Black", "White", "Blue"],
    sizes: ["7", "8", "9", "10", "11"],
    description:
      "Lightweight and responsive running shoes designed for maximum comfort and performance. Features advanced cushioning and support for both casual joggers and serious runners.",
    features: [
      "Breathable mesh upper",
      "Responsive foam midsole",
      "Durable rubber outsole",
      "Reflective details for visibility",
      "Removable cushioned insole",
    ],
    inStock: true,
    isFlashSale: true,
  },
  {
    id: 5,
    name: "Leather Dress Shoes",
    price: 129.99,
    originalPrice: 180.0,
    image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=300&h=300&fit=crop",
    category: "shoes",
    rating: 4.6,
    reviews: 67,
    colors: ["Black", "Brown"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    description:
      "Handcrafted genuine leather dress shoes that combine classic style with modern comfort. Perfect for formal occasions or professional settings.",
    features: [
      "Genuine leather upper",
      "Leather lining",
      "Cushioned footbed",
      "Goodyear welt construction",
      "Non-slip rubber sole",
    ],
    inStock: true,
    isFlashSale: false,
  },
  {
    id: 6,
    name: "Casual Canvas Shoes",
    price: 45.99,
    originalPrice: 65.99,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=300&h=300&fit=crop",
    category: "shoes",
    rating: 4.5,
    reviews: 134,
    colors: ["White", "Navy", "Red"],
    sizes: ["6", "7", "8", "9", "10"],
    description:
      "Versatile canvas shoes that combine comfort and style for everyday wear. Lightweight construction with durable materials for long-lasting use.",
    features: [
      "Breathable canvas upper",
      "Cushioned insole",
      "Vulcanized rubber outsole",
      "Reinforced toe cap",
      "Metal eyelets",
    ],
    inStock: true,
    isFlashSale: true,
  },

  // Salwar
  {
    id: 7,
    name: "Elegant Salwar Set",
    price: 45.99,
    originalPrice: 65.99,
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=300&h=300&fit=crop",
    category: "salwar",
    rating: 4.7,
    reviews: 156,
    colors: ["Blue", "Pink", "Green"],
    sizes: ["S", "M", "L", "XL"],
    description:
      "A beautifully crafted salwar set featuring intricate embroidery and premium fabric. Perfect for special occasions and celebrations.",
    features: [
      "Premium cotton blend",
      "Detailed embroidery work",
      "Contrast dupatta included",
      "Comfortable fit",
      "Easy maintenance",
    ],
    inStock: true,
    isFlashSale: false,
  },
  {
    id: 8,
    name: "Traditional Embroidered Salwar",
    price: 78.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=300&fit=crop",
    category: "salwar",
    rating: 4.8,
    reviews: 92,
    colors: ["Red", "Gold", "Purple"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "A stunning traditional salwar with elaborate embroidery and mirror work. Made from high-quality fabric for comfort and durability.",
    features: [
      "Heavy embroidery work",
      "Mirror and sequin details",
      "Matching dupatta",
      "Semi-stitched design",
      "Premium fabric quality",
    ],
    inStock: true,
    isFlashSale: true,
  },
  {
    id: 9,
    name: "Cotton Casual Salwar",
    price: 32.99,
    originalPrice: 45.99,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=300&fit=crop",
    category: "salwar",
    rating: 4.4,
    reviews: 78,
    colors: ["White", "Cream", "Light Blue"],
    sizes: ["S", "M", "L", "XL"],
    description:
      "A comfortable and stylish casual salwar made from breathable cotton. Perfect for everyday wear and informal gatherings.",
    features: [
      "100% cotton material",
      "Simple elegant design",
      "Comfortable fit",
      "Lightweight and breathable",
      "Easy to wash and maintain",
    ],
    inStock: true,
    isFlashSale: false,
  },
]

// Categories Data
const categories = [
  {
    name: "Socks",
    slug: "socks",
    image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=300&h=200&fit=crop",
    count: "150+ styles",
  },
  {
    name: "Shoes",
    slug: "shoes",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=200&fit=crop",
    count: "200+ styles",
  },
  {
    name: "Salwar",
    slug: "salwar",
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=300&h=200&fit=crop",
    count: "100+ styles",
  },
]

// Flash Sale Products
const flashSaleProducts = products.filter((product) => product.isFlashSale)

// Featured Products
const featuredProducts = products.slice(0, 4)
