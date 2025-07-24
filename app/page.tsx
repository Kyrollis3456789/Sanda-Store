"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Star, Truck, Shield, RefreshCw, Flame } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useSale } from "@/context/sale-context"
import { formatPrice } from "@/lib/utils"
import { FadeIn } from "@/components/animated/fade-in"
import { ScaleIn } from "@/components/animated/scale-in"
import { StaggerContainer, StaggerItem } from "@/components/animated/stagger-container"
import { HoverCard } from "@/components/animated/hover-card"
import { SlideIn } from "@/components/animated/slide-in"
import { FloatingElement } from "@/components/animated/floating-element"
import { motion } from "framer-motion"

export default function HomePage() {
  const { addItem } = useCart()
  const { saleProducts, flashSaleProducts } = useSale()

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

  const featuredProducts = [
    {
      id: 1,
      name: "Premium Cotton Socks",
      price: 12.99,
      originalPrice: 18.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "socks",
      rating: 4.8,
      reviews: 124,
    },
    {
      id: 2,
      name: "Running Sneakers",
      price: 89.99,
      originalPrice: 120.0,
      image: "/placeholder.svg?height=300&width=300",
      category: "shoes",
      rating: 4.9,
      reviews: 89,
    },
    {
      id: 3,
      name: "Elegant Salwar Set",
      price: 45.99,
      originalPrice: 65.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "salwar",
      rating: 4.7,
      reviews: 156,
    },
    {
      id: 4,
      name: "Leather Dress Shoes",
      price: 129.99,
      originalPrice: 180.0,
      image: "/placeholder.svg?height=300&width=300",
      category: "shoes",
      rating: 4.6,
      reviews: 67,
    },
  ]

  const categories = [
    {
      name: "Socks",
      image: "/placeholder.svg?height=200&width=300",
      href: "/category/socks",
      count: "150+ styles",
    },
    {
      name: "Shoes",
      image: "/placeholder.svg?height=200&width=300",
      href: "/category/shoes",
      count: "200+ styles",
    },
    {
      name: "Salwar",
      image: "/placeholder.svg?height=200&width=300",
      href: "/category/salwar",
      count: "100+ styles",
    },
  ]

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SlideIn direction="left">
                <motion.h1
                  className="text-4xl lg:text-6xl font-bold mb-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Step Into Style
                </motion.h1>
              </SlideIn>

              <FadeIn delay={0.4}>
                <p className="text-xl mb-8 opacity-90">
                  Discover our premium collection of socks, shoes, and traditional salwar. Quality craftsmanship meets
                  modern comfort.
                </p>
              </FadeIn>

              <FadeIn delay={0.6}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      className="bg-white text-purple-600 hover:bg-gray-100 transition-all duration-300"
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                      >
                        <ShoppingBag className="mr-2 h-5 w-5" />
                      </motion.div>
                      Shop Now
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/sale">
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white text-white hover:bg-white hover:text-purple-600 bg-transparent transition-all duration-300"
                      >
                        <Flame className="mr-2 h-5 w-5" />
                        View Sale
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </FadeIn>
            </div>

            <SlideIn direction="right" delay={0.3}>
              <FloatingElement intensity={15}>
                <div className="relative">
                  <motion.div whileHover={{ scale: 1.02, rotateY: 5 }} transition={{ duration: 0.3 }}>
                    <Image
                      src="/placeholder.svg?height=500&width=600"
                      alt="Fashion Hero"
                      width={600}
                      height={500}
                      className="rounded-lg shadow-2xl"
                    />
                  </motion.div>
                </div>
              </FloatingElement>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* Sale Banner */}
      {flashSaleProducts.length > 0 && (
        <section className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-4">
          <div className="container mx-auto px-4">
            <motion.div
              className="flex items-center justify-center gap-4 text-center"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <Flame className="h-6 w-6 animate-bounce" />
              <span className="text-lg font-bold">🔥 FLASH SALE: Up to 70% OFF - Limited Time!</span>
              <Flame className="h-6 w-6 animate-bounce" />
              <Link href="/sale">
                <Button size="sm" className="bg-white text-red-500 hover:bg-gray-100 ml-4">
                  Shop Now
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore our carefully curated collections designed for every occasion and style preference.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <StaggerItem key={category.name}>
                <Link href={category.href}>
                  <HoverCard scale={1.03} className="cursor-pointer">
                    <Card className="group hover:shadow-xl transition-all duration-500 overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.6, ease: "easeOut" }}>
                            <Image
                              src={category.image || "/placeholder.svg"}
                              alt={category.name}
                              width={300}
                              height={200}
                              className="w-full h-48 object-cover"
                            />
                          </motion.div>
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100"
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <motion.div className="p-6 text-center" whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                          <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-600 transition-colors duration-300">
                            {category.name}
                          </h3>
                          <p className="text-gray-600">{category.count}</p>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </HoverCard>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Flash Sale Products */}
      {flashSaleProducts.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="container mx-auto px-4">
            <FadeIn>
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                  >
                    <Flame className="h-8 w-8 text-red-500" />
                  </motion.div>
                  <h2 className="text-3xl font-bold">⚡ Flash Sale</h2>
                  <Badge className="bg-red-500 animate-pulse">Limited Time</Badge>
                </div>
                <p className="text-gray-600">Grab these deals before they're gone!</p>
              </div>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {flashSaleProducts.slice(0, 4).map((product, index) => (
                <StaggerItem key={product.id}>
                  <HoverCard scale={1.05}>
                    <Card className="group hover:shadow-xl transition-all duration-500 bg-white border-2 border-yellow-200 overflow-hidden">
                      <CardContent className="p-0">
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

                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: index * 0.1 + 0.5, duration: 0.5, type: "spring" }}
                          >
                            <Badge className="absolute top-2 left-2 bg-red-500 font-bold">
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
                        </div>

                        <div className="p-4">
                          <motion.h3
                            className="font-semibold mb-2 group-hover:text-orange-600 transition-colors duration-300"
                            whileHover={{ x: 2 }}
                          >
                            {product.name}
                          </motion.h3>

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

                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <motion.span className="text-lg font-bold text-red-600" whileHover={{ scale: 1.1 }}>
                                {formatPrice(product.salePrice)}
                              </motion.span>
                              <span className="text-sm text-gray-500 line-through ml-2">
                                {formatPrice(product.originalPrice!)}
                              </span>
                            </div>
                          </div>

                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300"
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

            <FadeIn delay={0.5}>
              <div className="text-center mt-8">
                <Link href="/sale">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                    >
                      View All Sale Items
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
              <p className="text-gray-600">Handpicked favorites from our latest collection</p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <StaggerItem key={product.id}>
                <HoverCard scale={1.05}>
                  <Card className="group hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <CardContent className="p-0">
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

                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: index * 0.1 + 0.5, duration: 0.5, type: "spring" }}
                        >
                          <Badge className="absolute top-2 left-2 bg-red-500">
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                          </Badge>
                        </motion.div>
                      </div>
                      <div className="p-4">
                        <motion.h3
                          className="font-semibold mb-2 group-hover:text-purple-600 transition-colors duration-300"
                          whileHover={{ x: 2 }}
                        >
                          {product.name}
                        </motion.h3>
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
                            <motion.span className="text-lg font-bold text-purple-600" whileHover={{ scale: 1.1 }}>
                              {formatPrice(product.price)}
                            </motion.span>
                            <span className="text-sm text-gray-500 line-through ml-2">
                              {formatPrice(product.originalPrice)}
                            </span>
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
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Truck,
                title: "Free Shipping",
                desc: "Free shipping on orders over $50. Fast and reliable delivery.",
              },
              { icon: Shield, title: "Secure Payment", desc: "Your payment information is always safe and secure." },
              { icon: RefreshCw, title: "Easy Returns", desc: "30-day return policy. No questions asked." },
            ].map((feature, index) => (
              <StaggerItem key={feature.title}>
                <motion.div className="text-center" whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
                  <motion.div
                    className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "#e879f9",
                      transition: { duration: 0.3 },
                    }}
                  >
                    <motion.div
                      animate={{
                        rotate: feature.title === "Easy Returns" ? [0, 360] : 0,
                        y: feature.title === "Free Shipping" ? [0, -2, 0] : 0,
                      }}
                      transition={{
                        duration: feature.title === "Easy Returns" ? 2 : 1,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 3,
                      }}
                    >
                      <feature.icon className="h-8 w-8 text-purple-600" />
                    </motion.div>
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
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

        <div className="container mx-auto px-4 text-center relative z-10">
          <FadeIn>
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8 opacity-90">Subscribe to our newsletter for exclusive deals and new arrivals.</p>
          </FadeIn>

          <ScaleIn delay={0.3}>
            <div className="max-w-md mx-auto flex gap-4">
              <motion.input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none transition-all duration-300"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 transition-all duration-300">
                  <motion.span whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
                    Subscribe
                  </motion.span>
                </Button>
              </motion.div>
            </div>
          </ScaleIn>
        </div>
      </section>
    </div>
  )
}
