"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  depth?: number
  glare?: boolean
  children: React.ReactNode
}

export function Card3D({ depth = 5, glare = true, className, children, ...props }: Card3DProps) {
  const cardRef = React.useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = React.useState(0)
  const [rotateY, setRotateY] = React.useState(0)
  const [glarePosition, setGlarePosition] = React.useState({ x: 0, y: 0 })
  const [mouseOver, setMouseOver] = React.useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX
    const mouseY = e.clientY

    // Calculate rotation based on mouse position
    const rotateXValue = ((mouseY - centerY) / (rect.height / 2)) * depth
    const rotateYValue = ((centerX - mouseX) / (rect.width / 2)) * depth

    setRotateX(rotateXValue)
    setRotateY(rotateYValue)

    // Calculate glare position
    if (glare) {
      const glareX = ((mouseX - rect.left) / rect.width) * 100
      const glareY = ((mouseY - rect.top) / rect.height) * 100
      setGlarePosition({ x: glareX, y: glareY })
    }
  }

  const handleMouseEnter = () => {
    setMouseOver(true)
  }

  const handleMouseLeave = () => {
    setMouseOver(false)
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative transition-transform duration-200 ease-out transform-gpu",
        mouseOver ? "z-10" : "z-0",
        className,
      )}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${mouseOver ? 1.02 : 1})`,
        transition: "transform 0.2s ease-out",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
      {glare && mouseOver && (
        <div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 80%)`,
            zIndex: 2,
          }}
        />
      )}
    </div>
  )
}

export default Card3D
