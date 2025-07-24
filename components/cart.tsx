"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export function Cart() {
  const { items, totalItems, subtotal, removeItem, updateQuantity, clearCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <motion.div
            animate={{
              rotate: totalItems > 0 ? [0, -10, 10, 0] : 0,
            }}
            transition={{
              duration: 0.5,
              repeat: totalItems > 0 ? 1 : 0,
            }}
          >
            <ShoppingCart className="h-5 w-5" />
          </motion.div>
          <AnimatePresence>
            {totalItems > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-purple-600">
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {totalItems}
                  </motion.span>
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
            </motion.div>
            Your Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center h-[70vh]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 1,
              }}
            >
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            </motion.div>
            <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6 text-center">Looks like you haven't added any items to your cart yet.</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => setIsOpen(false)} className="bg-purple-600 hover:bg-purple-700">
                Continue Shopping
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="space-y-4 mt-4 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${item.size}-${item.color}`}
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex gap-4 overflow-hidden"
                  >
                    <motion.div className="relative h-20 w-20 rounded-md overflow-hidden" whileHover={{ scale: 1.05 }}>
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <Link
                          href={`/product/${item.id}`}
                          className="font-medium hover:text-purple-600 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          <motion.span whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
                            {item.name}
                          </motion.span>
                        </Link>
                        <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-red-500"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </div>
                      <div className="text-sm text-gray-500 space-y-1">
                        {item.size && <p>Size: {item.size}</p>}
                        {item.color && <p>Color: {item.color}</p>}
                        <p>Price: {formatPrice(item.price)}</p>
                      </div>
                      <div className="flex items-center mt-2">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-full bg-transparent"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                        </motion.div>
                        <motion.span
                          className="w-8 text-center"
                          key={item.quantity}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.quantity}
                        </motion.span>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-full bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <Separator />

            <motion.div
              className="space-y-4 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex justify-between">
                <span>Subtotal</span>
                <motion.span
                  className="font-medium"
                  key={subtotal}
                  initial={{ scale: 1.1, color: "#9333ea" }}
                  animate={{ scale: 1, color: "#000000" }}
                  transition={{ duration: 0.3 }}
                >
                  {formatPrice(subtotal)}
                </motion.span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <motion.span
                  key={subtotal}
                  initial={{ scale: 1.1, color: "#9333ea" }}
                  animate={{ scale: 1, color: "#000000" }}
                  transition={{ duration: 0.3 }}
                >
                  {formatPrice(subtotal)}
                </motion.span>
              </div>

              <div className="space-y-2 pt-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 transition-all duration-300">
                    <motion.span whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
                      Proceed to Checkout
                    </motion.span>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => clearCart()}>
                    Clear Cart
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
