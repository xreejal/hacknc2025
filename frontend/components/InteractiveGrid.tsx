"use client";

import { useEffect, useRef, useState } from 'react'

export function InteractiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const gridSize = 40
    const dots: { x: number; y: number; baseX: number; baseY: number }[] = []

    for (let x = 0; x < canvas.width; x += gridSize) {
      for (let y = 0; y < canvas.height; y += gridSize) {
        dots.push({ x, y, baseX: x, baseY: y })
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', handleMouseMove)

    let animationId: number
    const animate = () => {
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      dots.forEach((dot) => {
        const dx = mouseRef.current.x - dot.baseX
        const dy = mouseRef.current.y - dot.baseY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 200

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance
          dot.x = dot.baseX + dx * force * 0.3
          dot.y = dot.baseY + dy * force * 0.3
        } else {
          dot.x += (dot.baseX - dot.x) * 0.1
          dot.y += (dot.baseY - dot.y) * 0.1
        }

        dots.forEach((otherDot) => {
          const dx = dot.x - otherDot.x
          const dy = dot.y - otherDot.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < gridSize * 1.5 && dist > 0) {
            const opacity = 1 - dist / (gridSize * 1.5)
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.2})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(dot.x, dot.y)
            ctx.lineTo(otherDot.x, otherDot.y)
            ctx.stroke()
          }
        })

        const mouseDist = Math.sqrt(
          (mouseRef.current.x - dot.x) ** 2 + (mouseRef.current.y - dot.y) ** 2
        )
        const dotSize = mouseDist < maxDistance ? 2 + (1 - mouseDist / maxDistance) * 2 : 1.5
        const dotOpacity = mouseDist < maxDistance ? 0.4 + (1 - mouseDist / maxDistance) * 0.6 : 0.25

        ctx.fillStyle = `rgba(139, 92, 246, ${dotOpacity})`
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2)
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isClient])

  if (!isClient) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      className="z-0 fixed inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}
