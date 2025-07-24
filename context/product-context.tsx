"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { products as initialProducts } from "@/data/products"

export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviews: number
  colors?: string[]
  sizes?: string[]
  description?: string
  features?: string[]
  images?: string[]
  inStock?: boolean
}

interface ProductFilters {
  category?: string
  colors?: string[]
  sizes?: string[]
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  searchQuery?: string
}

interface ProductContextType {
  products: Product[]
  filteredProducts: Product[]
  filters: ProductFilters
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>
  getProductById: (id: number) => Product | undefined
  getRelatedProducts: (id: number, limit?: number) => Product[]
  searchProducts: (query: string) => Product[]
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products] = useState<Product[]>(initialProducts)
  const [filters, setFilters] = useState<ProductFilters>({})
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)

  // Apply filters whenever filters or products change
  useEffect(() => {
    let result = [...products]

    // Filter by category
    if (filters.category) {
      result = result.filter((product) => product.category === filters.category)
    }

    // Filter by colors
    if (filters.colors && filters.colors.length > 0) {
      result = result.filter((product) => product.colors?.some((color) => filters.colors?.includes(color)))
    }

    // Filter by sizes
    if (filters.sizes && filters.sizes.length > 0) {
      result = result.filter((product) => product.sizes?.some((size) => filters.sizes?.includes(size)))
    }

    // Filter by price range
    if (filters.minPrice !== undefined) {
      result = result.filter((product) => product.price >= filters.minPrice!)
    }

    if (filters.maxPrice !== undefined) {
      result = result.filter((product) => product.price <= filters.maxPrice!)
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query),
      )
    }

    // Sort products
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price-low":
          result.sort((a, b) => a.price - b.price)
          break
        case "price-high":
          result.sort((a, b) => b.price - a.price)
          break
        case "rating":
          result.sort((a, b) => b.rating - a.rating)
          break
        case "newest":
          // Assuming newer products have higher IDs
          result.sort((a, b) => b.id - a.id)
          break
        // Default is "featured" - no sorting needed
      }
    }

    setFilteredProducts(result)
  }, [filters, products])

  const getProductById = (id: number) => {
    return products.find((product) => product.id === id)
  }

  const getRelatedProducts = (id: number, limit = 3) => {
    const product = getProductById(id)
    if (!product) return []

    return products.filter((p) => p.category === product.category && p.id !== id).slice(0, limit)
  }

  const searchProducts = (query: string) => {
    if (!query) return []

    const lowercaseQuery = query.toLowerCase()
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description?.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery),
    )
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        filteredProducts,
        filters,
        setFilters,
        getProductById,
        getRelatedProducts,
        searchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider")
  }
  return context
}
