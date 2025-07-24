import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/context/cart-context"
import { ProductProvider } from "@/context/product-context"
import { SaleProvider } from "@/context/sale-context"
import { WishlistProvider } from "@/context/wishlist-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StyleStep - Premium Socks, Shoes & Salwar",
  description:
    "Discover our premium collection of socks, shoes, and traditional salwar. Quality craftsmanship meets modern comfort.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProductProvider>
          <SaleProvider>
            <WishlistProvider>
              <CartProvider>
                <Header />
                <main>{children}</main>
                <Footer />
                <Toaster />
              </CartProvider>
            </WishlistProvider>
          </SaleProvider>
        </ProductProvider>
      </body>
    </html>
  )
}
