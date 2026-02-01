"use client"

import { useEffect, useRef } from "react"

interface FluidBackgroundProps {
  className?: string
  intensity?: number
}

export function FluidBackground({ className = "", intensity = 1 }: FluidBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const context = ctx as CanvasRenderingContext2D

    let width = canvas.clientWidth
    let height = canvas.clientHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    context.scale(dpr, dpr)

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const blobs = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 120 + Math.random() * 80,
      vx: ((Math.random() - 0.5) * 0.4) * intensity,
      vy: ((Math.random() - 0.5) * 0.4) * intensity,
      color: i % 2 === 0 ? "#0033CC" : "#111111"
    }))

    function drawGradientBlob(x: number, y: number, r: number, color: string) {
      const grd = context.createRadialGradient(x, y, 0, x, y, r)
      grd.addColorStop(0, color + "11")
      grd.addColorStop(0.5, color + "09")
      grd.addColorStop(1, "transparent")
      context.fillStyle = grd
      context.beginPath()
      context.arc(x, y, r, 0, Math.PI * 2)
      context.fill()
    }

    function render() {
      context.clearRect(0, 0, width, height)
      context.globalCompositeOperation = "lighter"
      blobs.forEach(b => {
        drawGradientBlob(b.x, b.y, b.r, b.color)
      })
      context.globalCompositeOperation = "source-over"
    }

    function update() {
      blobs.forEach(b => {
        b.x += b.vx
        b.y += b.vy
        if (b.x < -b.r) b.x = width + b.r
        if (b.x > width + b.r) b.x = -b.r
        if (b.y < -b.r) b.y = height + b.r
        if (b.y > height + b.r) b.y = -b.r
      })
    }

    function loop() {
      update()
      render()
      rafRef.current = requestAnimationFrame(loop)
    }

    function onResize() {
      const c = canvasRef.current
      if (!c) return
      width = c.clientWidth
      height = c.clientHeight
      c.width = Math.floor(width * dpr)
      c.height = Math.floor(height * dpr)
      context.scale(dpr, dpr)
      render()
    }

    window.addEventListener("resize", onResize)
    render()
    if (!prefersReducedMotion) {
      rafRef.current = requestAnimationFrame(loop)
    }

    return () => {
      window.removeEventListener("resize", onResize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [intensity])

  return (
    <canvas
      ref={canvasRef}
      className={"absolute inset-0 -z-10 w-full h-full [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)] " + className}
      aria-hidden
    />
  )
}
