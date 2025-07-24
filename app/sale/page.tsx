"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Flame, Zap, Timer, ShoppingCart } from "lucide-react"
import { useSale } from "@/context/sale-context"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/lib/utils"
import { FadeIn } from "@/components/animated/fade-in"
import { StaggerContainer, StaggerItem } from "@/components/animated/stagger-container"
import { HoverCard } from "@/components/animated/hover-card"
import { motion, AnimatePresence } from "framer-motion"

export default function SalePage() {
  const { saleProducts, flashSaleProducts, timeRemaining } = useSale()
  const { addItem } = useCart()
  const [sortBy, setSortBy] = useState("discount-high")
  const [filterBy, setFilterBy] = useState("all")

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.image,
      quantity: 1,
      size: product.sizes?.[0],
      color: product.colors?.[0],
    })
  }

  // Sort products
  const sortedProducts = [...saleProducts].sort((a, b) => {
    switch (sortBy) {
      case "discount-high":
        return b.discountPercentage - a.discountPercentage
      case "discount-low":
        return a.discountPercentage - b.discountPercentage
      case "price-low":
        return a.salePrice - b.salePrice
      case "price-high":
        return b.salePrice - a.salePrice
      case "stock-low":
        return (a.saleStock || 0) - (b.saleStock || 0)
      default:
        return 0
    }
  })

  // Filter products
  const filteredProducts = sortedProducts.filter((product) => {
    switch (filterBy) {
      case "flash":
        return product.isFlashSale
      case "socks":
        return product.category === "socks"
      case "shoes":
        return product.category === "shoes"
      case "salwar":
        return product.category === "salwar"
      case "high-discount":
        return product.discountPercentage >= 50
      case "low-stock":
        return (product.saleStock || 0) <= 20
      default:
        return true
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Sale Header */}
        <FadeIn>
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full mb-4"
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 0 0 rgba(239, 68, 68, 0.7)",
                  "0 0 0 10px rgba(239, 68, 68, 0)",
                  "0 0 0 0 rgba(239, 68, 68, 0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
              }}
            >
              <Flame className="h-5 w-5" />
              <span className="font-bold">MEGA SALE</span>
              <Flame className="h-5 w-5" />
            </motion.div>

            <motion.h1
              className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Up to 70% Off
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Limited time offers on your favorite products
            </motion.p>

            {/* Countdown Timer */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Timer className="h-5 w-5 text-red-500" />
                <span className="font-semibold text-gray-800">Sale Ends In:</span>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Days", value: timeRemaining.days },
                  { label: "Hours", value: timeRemaining.hours },
                  { label: "Minutes", value: timeRemaining.minutes },
                  { label: "Seconds", value: timeRemaining.seconds },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="text-center"
                    animate={{ scale: item.label === "Seconds" ? [1, 1.1, 1] : 1 }}
                    transition={{ duration: 1, repeat: item.label === "Seconds" ? Number.POSITIVE_INFINITY : 0 }}
                  >
                    <div className="bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-lg p-3 mb-2">
                      <motion.span
                        className="text-2xl font-bold"
                        key={item.value}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {item.value.toString().padStart(2, "0")}
                      </motion.span>
                    </div>
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </FadeIn>

        {/* Flash Sale Section */}
        {flashSaleProducts.length > 0 && (
          <FadeIn delay={0.2}>
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                >
                  <Zap className="h-6 w-6 text-yellow-500" />
                </motion.div>
                <h2 className="text-2xl font-bold">⚡ Flash Sale</h2>
                <Badge className="bg-yellow-500 text-black animate-pulse">Limited Time</Badge>
              </div>

              <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {flashSaleProducts.slice(0, 4).map((product, index) => (
                  <StaggerItem key={product.id}>
                    <HoverCard scale={1.05}>
                      <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 overflow-hidden">
                        <CardContent className="p-0">
                          <div className="relative overflow-hidden rounded-t-lg">
                            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.6 }}>
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                width={300}
                                height={300}
                                className="w-full h-48 object-cover"
                              />
                            </motion.div>

                            <motion.div
                              className="absolute top-2 left-2"
                              animate={{ rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                            >
                              <Badge className="bg-red-500 text-white font-bold">
                                {product.discountPercentage}% OFF
                              </Badge>
                            </motion.div>

                            <motion.div
                              className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                            >
                              ⚡ FLASH
                            </motion.div>

                            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                              Only {product.saleStock} left!
                            </div>
                          </div>

                          <div className="p-4">
                            <h3 className="font-semibold mb-2 group-hover:text-orange-600 transition-colors">
                              {product.name}
                            </h3>

                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <span className="text-lg font-bold text-red-600">{formatPrice(product.salePrice)}</span>
                                <span className="text-sm text-gray-500 line-through ml-2">
                                  {formatPrice(product.originalPrice!)}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                              </div>
                            </div>

                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                                onClick={() => handleAddToCart(product)}
                              >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add to Cart
                              </Button>
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </HoverCard>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </FadeIn>
        )}

        {/* Filters and Sort */}
        <FadeIn delay={0.3}>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4">
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    <SelectItem value="flash">⚡ Flash Sale</SelectItem>
                    <SelectItem value="high-discount">🔥 50%+ Off</SelectItem>
                    <SelectItem value="low-stock">⏰ Low Stock</SelectItem>
                    <SelectItem value="socks">🧦 Socks</SelectItem>
                    <SelectItem value="shoes">👟 Shoes</SelectItem>
                    <SelectItem value="salwar">👗 Salwar</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discount-high">Highest Discount</SelectItem>
                    <SelectItem value="discount-low">Lowest Discount</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="stock-low">Low Stock First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <motion.div
                className="text-lg font-semibold text-purple-600"
                key={filteredProducts.length}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {filteredProducts.length} Sale Items
              </motion.div>
            </div>
          </div>
        </FadeIn>

        {/* Sale Products Grid */}
        <AnimatePresence mode="wait">
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <StaggerItem key={product.id}>
                <HoverCard scale={1.03}>
                  <Card className="group hover:shadow-xl transition-all duration-500 bg-white overflow-hidden">
                    <CardContent className="p-0">
                      <Link href={`/product/${product.id}`}>
                        <div className="relative overflow-hidden rounded-t-lg">
                          <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.6 }}>
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              width={300}
                              height={300}
                              className="w-full h-56 object-cover"
                            />
                          </motion.div>

                          {/* Discount Badge */}
                          <motion.div
                            className="absolute top-2 left-2"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5, type: "spring" }}
                          >
                            <Badge
                              className={`font-bold ${
                                product.discountPercentage >= 50
                                  ? "bg-red-500"
                                  : product.discountPercentage >= 30
                                    ? "bg-orange-500"
                                    : "bg-purple-500"
                              }`}
                            >
                              {product.discountPercentage}% OFF
                            </Badge>
                          </motion.div>

                          {/* Flash Sale Badge */}
                          {product.isFlashSale && (
                            <motion.div
                              className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                            >
                              ⚡
                            </motion.div>
                          )}

                          {/* Stock Indicator */}
                          {(product.saleStock || 0) <= 20 && (
                            <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                              Only {product.saleStock} left!
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="p-4">
                        <Link href={`/product/${product.id}`}>
                          <motion.h3
                            className="font-semibold mb-2 group-hover:text-purple-600 transition-colors"
                            whileHover={{ x: 2 }}
                          >
                            {product.name}
                          </motion.h3>
                        </Link>

                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-600 ml-1">
                              {product.rating} ({product.reviews})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <motion.span className="text-lg font-bold text-red-600" whileHover={{ scale: 1.05 }}>
                              {formatPrice(product.salePrice)}
                            </motion.span>
                            <span className="text-sm text-gray-500 line-through ml-2">
                              {formatPrice(product.originalPrice!)}
                            </span>
                          </div>
                          <span className="text-sm text-green-600 font-medium">
                            Save {formatPrice(product.originalPrice! - product.salePrice)}
                          </span>
                        </div>

                        {/* Stock Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Stock</span>
                            <span>
                              {product.saleStock}/{product.originalStock}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              className={`h-2 rounded-full ${
                                (product.saleStock || 0) <= 20
                                  ? "bg-red-500"
                                  : (product.saleStock || 0) <= 50
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}
                              initial={{ width: 0 }}
                              animate={{
                                width: `${((product.saleStock || 0) / (product.originalStock || 100)) * 100}%`,
                              }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </div>
                        </div>

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            onClick={() => handleAddToCart(product)}
                          >
                            <motion.span whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
                              Add to Cart
                            </motion.span>
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </AnimatePresence>

        {/* No Results */}
        {filteredProducts.length === 0 && (
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
              🛍️
            </motion.div>
            <h3 className="text-xl font-medium mb-2">No sale items found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters to see more products.</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => setFilterBy("all")} className="bg-purple-600 hover:bg-purple-700">
                Show All Sale Items
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Sale Banner */}
        <FadeIn delay={0.5}>
          <div className="mt-16 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white rounded-2xl p-8 text-center relative overflow-hidden">
            <motion.div
              className="absolute inset-0 opacity-20"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
              style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "50px 50px",
              }}
            />

            <div className="relative z-10">
              <motion.h2
                className="text-3xl font-bold mb-4"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                Don't Miss Out!
              </motion.h2>
              <p className="text-xl mb-6 opacity-90">These amazing deals won't last forever. Shop now and save big!</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  Shop All Sale Items
                </Button>
              </motion.div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
