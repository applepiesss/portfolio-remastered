"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { cn } from "@/lib/utils"

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number
  gridGap?: number
  flickerChance?: number
  color?: string
  width?: number
  height?: number
  className?: string
  maxOpacity?: number
}

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "rgb(0, 0, 0)",
  width,
  height,
  className,
  maxOpacity = 0.3,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  const memoizedColor = useMemo(() => {
    const toRGBA = (color: string) => {
      if (typeof window === "undefined") {
        return `rgba(0, 0, 0,`
      }
      const canvas = document.createElement("canvas")
      canvas.width = canvas.height = 1
      const ctx = canvas.getContext("2d")
      if (!ctx) return "rgba(255, 0, 0,"
      ctx.fillStyle = color
      ctx.fillRect(0, 0, 1, 1)
      const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data)
      return `rgba(${r}, ${g}, ${b},`
    }
    return toRGBA(color)
  }, [color])

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, width: number, height: number) => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      const cols = Math.ceil(width / (squareSize + gridGap))
      const rows = Math.ceil(height / (squareSize + gridGap))

      const squares = new Float32Array(cols * rows)
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity
      }

      return { cols, rows, squares, dpr }
    },
    [squareSize, gridGap, maxOpacity]
  )

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          squares[i] = Math.random() * maxOpacity
        }
      }
    },
    [flickerChance, maxOpacity]
  )

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number,
      time: number
    ) => {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = "transparent"
      ctx.fillRect(0, 0, width, height)

      const cx = cols / 2
      const cy = rows / 2
      const maxDist = Math.sqrt(cx * cx + cy * cy)

      // Pastel Pink to Darker Pastel Pink
      const c1 = { r: 255, g: 192, b: 203 } // Pink
      const c2 = { r: 219, g: 112, b: 147 } // PaleVioletRed

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const dx = i - cx
          const dy = j - cy
          
          // Domain warping: very gentle, slow frequencies to keep it organic but not sharp
          const warpX = dx + Math.sin(dy * 0.02 + time * 0.1) * 20.0 + Math.cos(dx * 0.015) * 10.0
          const warpY = dy + Math.cos(dx * 0.02 - time * 0.08) * 20.0 + Math.sin(dy * 0.015) * 10.0
          
          const dist = Math.sqrt(warpX * warpX + warpY * warpY)
          const angle = Math.atan2(warpY, warpX)

          // Smooth out the center
          const effectiveAngle = angle * Math.min(1, dist / 20)

          // 1. Non-uniform "Keriting" (Curly) Effect: 
          // Gentler, lower amplitude to avoid sharp points ("lancip")
          const curlFreq = 6 + Math.sin(dist * 0.03) * 4
          const curlAmp = 1.0 + Math.cos(angle * 2 + time * 0.2) * 2.0
          const curl = Math.cos(angle * curlFreq + dist * 0.15 + time * 0.4) * curlAmp
          
          // 2. Slow organic drift
          const drift = Math.sin(dist * 0.05 - time * 0.1) * 3.0

          const organicDist = dist + curl + drift

          // The core spiral math. Rotation speed very slow (time * 0.15)
          const spiralValue = Math.cos(organicDist * 0.08 - effectiveAngle - time * 0.15)

          // Highly non-uniform thickness. It pinches and thickens randomly but smoothly.
          const thicknessVar = Math.sin(angle * 2 + dist * 0.03) * 0.3 + Math.cos(angle * 4 - time * 0.2) * 0.2
          const threshold = -0.1 + thicknessVar

          if (spiralValue > threshold) {
            const opacity = squares[i * rows + j]
            
            // Vibrant but Pastel Pink (#FF82A5)
            ctx.fillStyle = `rgba(255, 130, 165, ${opacity})`
            ctx.fillRect(
              i * (squareSize + gridGap) * dpr,
              j * (squareSize + gridGap) * dpr,
              squareSize * dpr,
              squareSize * dpr
            )
          }
        }
      }
    },
    [squareSize, gridGap]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    const ctx = canvas?.getContext("2d") ?? null
    let animationFrameId: number | null = null
    let resizeObserver: ResizeObserver | null = null
    let intersectionObserver: IntersectionObserver | null = null
    let gridParams: ReturnType<typeof setupCanvas> | null = null

    if (canvas && container && ctx) {
      const updateCanvasSize = () => {
        const newWidth = width || container.clientWidth
        const newHeight = height || container.clientHeight
        setCanvasSize({ width: newWidth, height: newHeight })
        gridParams = setupCanvas(canvas, newWidth, newHeight)
      }

      updateCanvasSize()

      let lastTime = 0
      let elapsedTime = 0
      const animate = (time: number) => {
        if (!isInView || !gridParams) return

        const deltaTime = lastTime === 0 ? 0 : (time - lastTime) / 1000
        lastTime = time
        elapsedTime += deltaTime

        updateSquares(gridParams.squares, deltaTime)
        drawGrid(
          ctx,
          canvas.width,
          canvas.height,
          gridParams.cols,
          gridParams.rows,
          gridParams.squares,
          gridParams.dpr,
          elapsedTime
        )
        animationFrameId = requestAnimationFrame(animate)
      }

      resizeObserver = new ResizeObserver(() => {
        updateCanvasSize()
      })
      resizeObserver.observe(container)

      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          setIsInView(entry.isIntersecting)
        },
        { threshold: 0 }
      )
      intersectionObserver.observe(canvas)

      if (isInView) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      if (intersectionObserver) {
        intersectionObserver.disconnect()
      }
    }
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView])

  return (
    <div
      ref={containerRef}
      className={cn(`h-full w-full ${className}`)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
        }}
      />
    </div>
  )
}
