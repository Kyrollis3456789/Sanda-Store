"use client"

import { motion } from "framer-motion"
import type React from "react"

interface FloatingElementProps {
  children: React.ReactNode
  className?: string
  intensity?: number
}

export function FloatingElement({ children, className, intensity = 10 }: FloatingElementProps) {
  return (
    <motion.div
      animate={{
        y: [-intensity, intensity, -intensity],
      }}
      transition={{
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
