"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { products } from "@/data/products"
import type { Product } from "@/context/product-context"

interface SaleProduct extends Product {
  salePrice: number
  discountPercentage: number
  saleEndDate: Date
  isFlashSale?: boolean
  originalStock?: number
  saleStock?: number
}

interface SaleContextType {
  saleProducts: SaleProduct[]
  flashSaleProducts: SaleProduct[]
  getSaleProductById: (id: number) => SaleProduct | undefined
  isProductOnSale: (id: number) => boolean
  getDiscountPercentage: (id: number) => number
  saleEndTime: Date
  timeRemaining: {
    days: number
    hours: number
    minutes: number
    seconds: number
  }
}

const SaleContext = createContext<SaleContextType | undefined>(undefined)

export function SaleProvider({ children }: { children: React.ReactNode }) {
  // Create sale products with additional discounts
  const saleProducts: SaleProduct[] = products
    .filter((product) => product.originalPrice) // Only products with original prices
    .map((product) => {
      const additionalDiscount = Math.floor(Math.random() * 30) + 10 // 10-40% additional discount
      const salePrice = product.price * (1 - additionalDiscount / 100)
      const totalDiscount = ((product.originalPrice! - salePrice) / product.originalPrice!) * 100

      return {
        ...product,
        price: salePrice,
        salePrice,
        discountPercentage: Math.round(totalDiscount),
        saleEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        isFlashSale: Math.random() > 0.7, // 30% chance of being flash sale
        originalStock: 100,
        saleStock: Math.floor(Math.random() * 50) + 10, // 10-60 items left
      }
    })

  // Flash sale products (limited time, higher discounts)
  const flashSaleProducts = saleProducts.filter((product) => product.isFlashSale)

  const saleEndTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Update countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = saleEndTime.getTime() - now

      if (distance > 0) {
        setTimeRemaining({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [saleEndTime])

  const getSaleProductById = (id: number) => {
    return saleProducts.find((product) => product.id === id)
  }

  const isProductOnSale = (id: number) => {
    return saleProducts.some((product) => product.id === id)
  }

  const getDiscountPercentage = (id: number) => {
    const saleProduct = getSaleProductById(id)
    return saleProduct?.discountPercentage || 0
  }

  return (
    <SaleContext.Provider
      value={{
        saleProducts,
        flashSaleProducts,
        getSaleProductById,
        isProductOnSale,
        getDiscountPercentage,
        saleEndTime,
        timeRemaining,
      }}
    >
      {children}
    </SaleContext.Provider>
  )
}

export function useSale() {
  const context = useContext(SaleContext)
  if (context === undefined) {
    throw new Error("useSale must be used within a SaleProvider")
  }
  return context
}
