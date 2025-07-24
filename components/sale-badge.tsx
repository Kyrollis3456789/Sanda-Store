"use client"

import { Badge } from "@/components/ui/badge"
import { useSale } from "@/context/sale-context"
import { motion } from "framer-motion"

interface SaleBadgeProps {
  productId: number
  className?: string
}

export function SaleBadge({ productId, className }: SaleBadgeProps) {
  const { isProductOnSale, getDiscountPercentage, getSaleProductById } = useSale()

  if (!isProductOnSale(productId)) {
    return null
  }

  const discountPercentage = getDiscountPercentage(productId)
  const saleProduct = getSaleProductById(productId)

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className={className}
    >
      <Badge
        className={`font-bold ${
          saleProduct?.isFlashSale
            ? "bg-yellow-500 text-black animate-pulse"
            : discountPercentage >= 50
              ? "bg-red-500"
              : discountPercentage >= 30
                ? "bg-orange-500"
                : "bg-purple-500"
        }`}
      >
        {saleProduct?.isFlashSale && "⚡ "}
        {discountPercentage}% OFF
      </Badge>
    </motion.div>
  )
}
