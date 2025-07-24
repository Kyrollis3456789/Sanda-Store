"use client"

import { motion } from "framer-motion"
import type React from "react"

interface HoverCardProps {
  children: React.ReactNode
  className?: string
  scale?: number
  rotateY?: number
}

export function HoverCard({ children, className, scale = 1.05, rotateY = 0 }: HoverCardProps) {
  return (
    <motion.div
      whileHover={{
        scale,
        rotateY,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
