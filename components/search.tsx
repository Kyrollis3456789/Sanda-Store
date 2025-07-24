"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { SearchIcon, X } from "lucide-react"
import { useProducts } from "@/context/product-context"
import { formatPrice } from "@/lib/utils"

export function Search() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const { searchProducts } = useProducts()
  const [results, setResults] = useState<any[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Update search results when query changes
  useEffect(() => {
    if (query.trim().length > 1) {
      setResults(searchProducts(query))
    } else {
      setResults([])
    }
  }, [query, searchProducts])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setResults(searchProducts(query))
    }
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    inputRef.current?.focus()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <SearchIcon className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0">
        <div className="p-4 border-b">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products..."
                className="pl-10 pr-10"
              />
              {query && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              Search
            </Button>
          </form>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {results.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">{results.length} results found</p>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <p className="text-purple-600 font-medium">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : query.length > 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No products found for "{query}"</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Start typing to search for products</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
