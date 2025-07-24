"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, Heart } from "lucide-react"
import { Cart } from "@/components/cart"
import { Search } from "@/components/search"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

export function Header() {
  const { totalItems } = useCart()
  const { wishlistCount } = useWishlist()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Socks", href: "/category/socks" },
    { name: "Shoes", href: "/category/shoes" },
    { name: "Salwar", href: "/category/salwar" },
    { name: "Sale", href: "/sale" },
  ]

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              className="bg-purple-600 text-white p-2 rounded-lg"
              whileHover={{
                scale: 1.1,
                rotate: 5,
                backgroundColor: "#e879f9",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </motion.svg>
            </motion.div>
            <motion.span
              className="text-xl font-bold text-gray-900"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              StyleStep
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-300 relative group"
                >
                  <motion.span whileHover={{ y: -1 }} transition={{ duration: 0.2 }}>
                    {item.name}
                  </motion.span>
                  <motion.div
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"
                    whileHover={{ width: "100%" }}
                  />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <motion.div className="hidden sm:flex" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Search />
            </motion.div>

            {/* Wishlist */}
            <Link href="/wishlist">
              <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" className="hidden sm:flex relative">
                  <motion.div
                    animate={{
                      scale: wishlistCount > 0 ? [1, 1.2, 1] : 1,
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: wishlistCount > 0 ? Number.POSITIVE_INFINITY : 0,
                      repeatDelay: 3,
                    }}
                  >
                    <Heart className={`h-5 w-5 ${wishlistCount > 0 ? "fill-red-500 text-red-500" : ""}`} />
                  </motion.div>

                  <AnimatePresence>
                    {wishlistCount > 0 && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                          <motion.span
                            key={wishlistCount}
                            initial={{ scale: 1.5 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {wishlistCount}
                          </motion.span>
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </Link>

            {/* Account */}
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <User className="h-5 w-5" />
              </Button>
            </motion.div>

            {/* Cart */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Cart />
            </motion.div>

            {/* Mobile Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <motion.div animate={{ rotate: isMenuOpen ? 90 : 0 }} transition={{ duration: 0.3 }}>
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <motion.div
                  className="flex flex-col space-y-4 mt-8"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className="text-lg font-medium text-gray-700 hover:text-purple-600 transition-colors duration-300 block"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <motion.span whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                          {item.name}
                        </motion.span>
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    className="border-t pt-4 space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    <Link href="/search" className="flex items-center space-x-2 text-gray-700">
                      <Search />
                      <span>Search</span>
                    </Link>
                    <Link href="/wishlist" className="flex items-center space-x-2 text-gray-700">
                      <Heart className={`h-5 w-5 ${wishlistCount > 0 ? "fill-red-500 text-red-500" : ""}`} />
                      <span>Wishlist {wishlistCount > 0 && `(${wishlistCount})`}</span>
                    </Link>
                    <Link href="/account" className="flex items-center space-x-2 text-gray-700">
                      <User className="h-5 w-5" />
                      <span>Account</span>
                    </Link>
                  </motion.div>
                </motion.div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
