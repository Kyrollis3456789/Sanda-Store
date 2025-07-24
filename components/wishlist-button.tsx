"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useWishlist } from "@/context/wishlist-context"
import type { Product } from "@/context/product-context"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  product: Product
  size?: "sm" | "md" | "lg"
  variant?: "default" | "ghost" | "outline"
  className?: string
  showText?: boolean
}

export function WishlistButton({
  product,
  size = "md",
  variant = "ghost",
  className,
  showText = false,
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const isLiked = isInWishlist(product.id)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
  }

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 0.2 }}
    >
      <Button
        variant={variant}
        size="icon"
        className={cn(
          sizeClasses[size],
          "relative transition-all duration-300",
          isLiked
            ? "text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100"
            : "text-gray-500 hover:text-red-500 hover:bg-red-50",
          className,
        )}
        onClick={handleClick}
      >
        <motion.div
          animate={
            isLiked
              ? {
                  scale: [1, 1.3, 1],
                  rotate: [0, 10, -10, 0],
                }
              : {}
          }
          transition={{ duration: 0.5 }}
        >
          <Heart
            className={cn(
              iconSizes[size],
              "transition-all duration-300",
              isLiked ? "fill-red-500 text-red-500" : "fill-none",
            )}
          />
        </motion.div>

        {/* Floating hearts animation when liked */}
        {isLiked && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 text-red-500"
                initial={{
                  scale: 0,
                  x: "-50%",
                  y: "-50%",
                  rotate: 0,
                }}
                animate={{
                  scale: [0, 1, 0],
                  x: `${-50 + (i - 1) * 30}%`,
                  y: `${-50 - i * 20}%`,
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
              >
                <Heart className="h-3 w-3 fill-red-500" />
              </motion.div>
            ))}
          </motion.div>
        )}

        {showText && <span className="ml-2 text-sm font-medium">{isLiked ? "Liked" : "Like"}</span>}
      </Button>
    </motion.div>
  )
}
