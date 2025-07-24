"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Star, Filter } from "lucide-react"
import { useProducts } from "@/context/product-context"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/lib/utils"
import { FadeIn } from "@/components/animated/fade-in"
import { StaggerContainer, StaggerItem } from "@/components/animated/stagger-container"
import { HoverCard } from "@/components/animated/hover-card"
import { WishlistButton } from "@/components/wishlist-button"
import { motion, AnimatePresence } from "framer-motion"

export default function CategoryPage({ params }: { params: { category: string } }) {
  const { products, filteredProducts, filters, setFilters } = useProducts()
  const { addItem } = useCart()

  // Set initial category filter when component mounts
  useEffect(() => {
    setFilters((prev) => ({ ...prev, category: params.category }))
  }, [params.category, setFilters])

  // Get all colors and sizes for this category
  const categoryProducts = products.filter((p) => p.category === params.category)
  const allColors = Array.from(new Set(categoryProducts.flatMap((p) => p.colors || [])))
  const allSizes = Array.from(new Set(categoryProducts.flatMap((p) => p.sizes || [])))

  const handleColorChange = (color: string, checked: boolean) => {
    setFilters((prev) => {
      const currentColors = prev.colors || []
      if (checked) {
        return { ...prev, colors: [...currentColors, color] }
      } else {
        return { ...prev, colors: currentColors.filter((c) => c !== color) }
      }
    })
  }

  const handleSizeChange = (size: string, checked: boolean) => {
    setFilters((prev) => {
      const currentSizes = prev.sizes || []
      if (checked) {
        return { ...prev, sizes: [...currentSizes, size] }
      } else {
        return { ...prev, sizes: currentSizes.filter((s) => s !== size) }
      }
    })
  }

  const handleSortChange = (value: string) => {
    setFilters((prev) => ({ ...prev, sortBy: value }))
  }

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

  const categoryTitles = {
    socks: "Premium Socks Collection",
    shoes: "Stylish Shoes Collection",
    salwar: "Traditional Salwar Collection",
  }

  const categoryDescriptions = {
    socks: "Comfortable and durable socks for every occasion",
    shoes: "Step out in style with our premium shoe collection",
    salwar: "Elegant traditional wear for special occasions",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <FadeIn>
          <div className="mb-8">
            <motion.h1
              className="text-3xl font-bold mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {categoryTitles[params.category as keyof typeof categoryTitles]}
            </motion.h1>
            <motion.p
              className="text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {categoryDescriptions[params.category as keyof typeof categoryDescriptions]}
            </motion.p>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                >
                  <Filter className="h-5 w-5 mr-2" />
                </motion.div>
                <h3 className="font-semibold">Filters</h3>
              </div>

              {/* Colors Filter */}
              {allColors.length > 0 && (
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <h4 className="font-medium mb-3">Colors</h4>
                  <div className="space-y-2">
                    {allColors.map((color, index) => (
                      <motion.div
                        key={color}
                        className="flex items-center space-x-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Checkbox
                          id={`color-${color}`}
                          checked={(filters.colors || []).includes(color)}
                          onCheckedChange={(checked) => handleColorChange(color, checked === true)}
                        />
                        <Label htmlFor={`color-${color}`} className="text-sm cursor-pointer">
                          {color}
                        </Label>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Sizes Filter */}
              {allSizes.length > 0 && (
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <h4 className="font-medium mb-3">Sizes</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {allSizes.map((size, index) => (
                      <motion.div
                        key={size}
                        className="flex items-center space-x-2"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Checkbox
                          id={`size-${size}`}
                          checked={(filters.sizes || []).includes(size)}
                          onCheckedChange={(checked) => handleSizeChange(size, checked === true)}
                        />
                        <Label htmlFor={`size-${size}`} className="text-sm cursor-pointer">
                          {size}
                        </Label>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Reset Filters */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent"
                  onClick={() => setFilters({ category: params.category })}
                >
                  Reset Filters
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort and Results */}
            <motion.div
              className="flex justify-between items-center mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.p
                className="text-gray-600"
                key={filteredProducts.length}
                initial={{ scale: 1.1, color: "#9333ea" }}
                animate={{ scale: 1, color: "#6b7280" }}
                transition={{ duration: 0.3 }}
              >
                Showing {filteredProducts.length} results
              </motion.p>
              <Select value={filters.sortBy || "featured"} onValueChange={handleSortChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {/* Products Grid */}
            <AnimatePresence mode="wait">
              <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <StaggerItem key={product.id}>
                    <HoverCard scale={1.03}>
                      <Card className="group hover:shadow-xl transition-all duration-500 bg-white overflow-hidden">
                        <CardContent className="p-0">
                          <Link href={`/product/${product.id}`}>
                            <div className="relative overflow-hidden rounded-t-lg">
                              <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.6, ease: "easeOut" }}>
                                <Image
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  width={300}
                                  height={300}
                                  className="w-full h-64 object-cover"
                                />
                              </motion.div>
                              {product.originalPrice && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ delay: index * 0.1, duration: 0.5, type: "spring" }}
                                >
                                  <Badge className="absolute top-2 left-2 bg-red-500">
                                    {Math.round(
                                      ((product.originalPrice - product.price) / product.originalPrice) * 100,
                                    )}
                                    % OFF
                                  </Badge>
                                </motion.div>
                              )}

                              {/* Wishlist Button */}
                              <div className="absolute top-2 right-2">
                                <WishlistButton product={product} size="sm" />
                              </div>
                            </div>
                          </Link>
                          <div className="p-4">
                            <Link href={`/product/${product.id}`}>
                              <motion.h3
                                className="font-semibold mb-2 group-hover:text-purple-600 transition-colors duration-300"
                                whileHover={{ x: 2 }}
                              >
                                {product.name}
                              </motion.h3>
                            </Link>
                            <div className="flex items-center mb-2">
                              <div className="flex items-center">
                                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                </motion.div>
                                <span className="text-sm text-gray-600 ml-1">
                                  {product.rating} ({product.reviews})
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <motion.span className="text-lg font-bold text-purple-600" whileHover={{ scale: 1.05 }}>
                                  {formatPrice(product.price)}
                                </motion.span>
                                {product.originalPrice && (
                                  <span className="text-sm text-gray-500 line-through ml-2">
                                    {formatPrice(product.originalPrice)}
                                  </span>
                                )}
                              </div>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  size="sm"
                                  className="bg-purple-600 hover:bg-purple-700 transition-all duration-300"
                                  onClick={() => handleAddToCart(product)}
                                >
                                  <motion.span whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
                                    Add to Cart
                                  </motion.span>
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
            {filteredProducts.length === 0 && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 1,
                  }}
                  className="text-6xl mb-4"
                >
                  🔍
                </motion.div>
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or browse our other categories.</p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => setFilters({ category: params.category })}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Reset Filters
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
