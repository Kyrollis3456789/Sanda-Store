"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ShoppingCart, Trash2, Share2 } from "lucide-react"
import { useWishlist } from "@/context/wishlist-context"
import { useCart } from "@/context/cart-context"
import { useSale } from "@/context/sale-context"
import { formatPrice } from "@/lib/utils"
import { FadeIn } from "@/components/animated/fade-in"
import { StaggerContainer, StaggerItem } from "@/components/animated/stagger-container"
import { HoverCard } from "@/components/animated/hover-card"
import { WishlistButton } from "@/components/wishlist-button"
import { motion, AnimatePresence } from "framer-motion"

export default function WishlistPage() {
  const { wishlistItems, clearWishlist } = useWishlist()
  const { addItem } = useCart()
  const { isProductOnSale, getDiscountPercentage } = useSale()
  const [sortBy, setSortBy] = useState("date-added")
  const [filterBy, setFilterBy] = useState("all")

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      size: product.sizes?.[0],
      color: product.colors?.[0],
    })
  }

  const handleAddAllToCart = () => {
    wishlistItems.forEach((product) => {
      handleAddToCart(product)
    })
  }

  // Sort wishlist items
  const sortedItems = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case "date-added":
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      case "date-oldest":
        return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "name":
        return a.name.localeCompare(b.name)
      case "rating":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  // Filter wishlist items
  const filteredItems = sortedItems.filter((item) => {
    switch (filterBy) {
      case "on-sale":
        return isProductOnSale(item.id)
      case "socks":
        return item.category === "socks"
      case "shoes":
        return item.category === "shoes"
      case "salwar":
        return item.category === "salwar"
      case "high-rated":
        return item.rating >= 4.5
      default:
        return true
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center gap-2 mb-4"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
              }}
            >
              <Heart className="h-8 w-8 text-red-500 fill-red-500" />
              <h1 className="text-3xl font-bold">My Wishlist</h1>
              <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            </motion.div>
            <p className="text-gray-600">
              {wishlistItems.length === 0
                ? "Your wishlist is empty. Start adding items you love!"
                : `You have ${wishlistItems.length} item${wishlistItems.length === 1 ? "" : "s"} in your wishlist`}
            </p>
          </div>
        </FadeIn>

        {wishlistItems.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
              }}
              className="text-8xl mb-6"
            >
              💔
            </motion.div>
            <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Discover amazing products and add them to your wishlist by clicking the heart icon on any product.
            </p>
            <Link href="/">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Heart className="mr-2 h-4 w-4" />
                  Start Shopping
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Controls */}
            <FadeIn delay={0.2}>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-wrap gap-4">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date-added">Recently Added</SelectItem>
                        <SelectItem value="date-oldest">Oldest First</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="name">Name A-Z</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filterBy} onValueChange={setFilterBy}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Items</SelectItem>
                        <SelectItem value="on-sale">🔥 On Sale</SelectItem>
                        <SelectItem value="high-rated">⭐ High Rated</SelectItem>
                        <SelectItem value="socks">🧦 Socks</SelectItem>
                        <SelectItem value="shoes">👟 Shoes</SelectItem>
                        <SelectItem value="salwar">👗 Salwar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={handleAddAllToCart}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={filteredItems.length === 0}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add All to Cart
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        onClick={clearWishlist}
                        className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                        disabled={wishlistItems.length === 0}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear All
                      </Button>
                    </motion.div>
                  </div>
                </div>

                {filteredItems.length !== wishlistItems.length && (
                  <motion.div
                    className="mt-4 text-sm text-gray-600"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    Showing {filteredItems.length} of {wishlistItems.length} items
                  </motion.div>
                )}
              </div>
            </FadeIn>

            {/* Wishlist Grid */}
            <AnimatePresence mode="wait">
              <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item, index) => (
                  <StaggerItem key={item.id}>
                    <HoverCard scale={1.03}>
                      <Card className="group hover:shadow-xl transition-all duration-500 bg-white overflow-hidden">
                        <CardContent className="p-0">
                          <Link href={`/product/${item.id}`}>
                            <div className="relative overflow-hidden rounded-t-lg">
                              <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.6 }}>
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  width={300}
                                  height={300}
                                  className="w-full h-56 object-cover"
                                />
                              </motion.div>

                              {/* Sale Badge */}
                              {isProductOnSale(item.id) && (
                                <motion.div
                                  className="absolute top-2 left-2"
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ delay: index * 0.1, duration: 0.5, type: "spring" }}
                                >
                                  <Badge className="bg-red-500 font-bold">{getDiscountPercentage(item.id)}% OFF</Badge>
                                </motion.div>
                              )}

                              {/* Wishlist Button */}
                              <div className="absolute top-2 right-2">
                                <WishlistButton product={item} size="sm" />
                              </div>

                              {/* Date Added */}
                              <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                                Added {new Date(item.dateAdded).toLocaleDateString()}
                              </div>
                            </div>
                          </Link>

                          <div className="p-4">
                            <Link href={`/product/${item.id}`}>
                              <motion.h3
                                className="font-semibold mb-2 group-hover:text-purple-600 transition-colors"
                                whileHover={{ x: 2 }}
                              >
                                {item.name}
                              </motion.h3>
                            </Link>

                            <div className="flex items-center mb-3">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    whileHover={{ rotate: 360, scale: 1.2 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <Heart
                                      className={`h-3 w-3 ${
                                        i < Math.floor(item.rating)
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  </motion.div>
                                ))}
                                <span className="text-sm text-gray-600 ml-2">
                                  {item.rating} ({item.reviews})
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <motion.span className="text-lg font-bold text-purple-600" whileHover={{ scale: 1.05 }}>
                                  {formatPrice(item.price)}
                                </motion.span>
                                {item.originalPrice && (
                                  <span className="text-sm text-gray-500 line-through ml-2">
                                    {formatPrice(item.originalPrice)}
                                  </span>
                                )}
                              </div>
                              {isProductOnSale(item.id) && (
                                <Badge className="bg-green-100 text-green-800 text-xs">ON SALE</Badge>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                  className="w-full bg-purple-600 hover:bg-purple-700"
                                  onClick={() => handleAddToCart(item)}
                                >
                                  <ShoppingCart className="mr-2 h-4 w-4" />
                                  Add to Cart
                                </Button>
                              </motion.div>

                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="outline" size="icon">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </motion.div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </HoverCard>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </AnimatePresence>

            {/* No Results */}
            {filteredItems.length === 0 && wishlistItems.length > 0 && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="text-6xl mb-4"
                >
                  🔍
                </motion.div>
                <h3 className="text-xl font-medium mb-2">No items match your filters</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters to see more items.</p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={() => setFilterBy("all")} className="bg-purple-600 hover:bg-purple-700">
                    Show All Items
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {/* Recommendations */}
            {wishlistItems.length > 0 && (
              <FadeIn delay={0.5}>
                <div className="mt-16 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 text-center">
                  <motion.h2
                    className="text-2xl font-bold mb-4"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    💝 Love Your Wishlist?
                  </motion.h2>
                  <p className="text-gray-600 mb-6">
                    Share your favorite items with friends or treat yourself to something special!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="bg-pink-500 hover:bg-pink-600">
                        <Heart className="mr-2 h-4 w-4" />
                        Share Wishlist
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" onClick={handleAddAllToCart}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Buy All Items
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </FadeIn>
            )}
          </>
        )}
      </div>
    </div>
  )
}
