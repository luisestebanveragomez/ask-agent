'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface AwwwardsBannerProps {
  className?: string
  title?: string
  subtitle?: string
  ctaText?: string
  onCTAClick?: () => void
}

export function AwwwardsBanner({
  className,
  title = 'Experience the Future',
  subtitle = 'Where innovation meets design',
  ctaText = 'Explore Now',
  onCTAClick = () => {},
}: AwwwardsBannerProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const bannerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (bannerRef.current) {
      const rect = bannerRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  return (
    <section
      ref={bannerRef}
      className={cn(
        'relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
        'cursor-none',
        className
      )}
      onMouseMove={handleMouseMove}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Interactive glow following cursor */}
      <div
        className="absolute w-96 h-96 bg-gradient-radial from-cyan-400/20 via-purple-600/10 to-transparent rounded-full blur-3xl transition-all duration-75 ease-out pointer-events-none"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className={cn(
            'absolute top-1/4 left-1/4 w-32 h-32 border border-cyan-400/30 rotate-45',
            'transition-transform duration-[3000ms] ease-out',
            isLoaded ? 'animate-spin' : ''
          )}
        />
        <div 
          className={cn(
            'absolute bottom-1/3 right-1/4 w-24 h-24 border border-purple-400/30',
            'transition-all duration-[4000ms] ease-out delay-500',
            isLoaded ? 'animate-bounce' : ''
          )}
        />
        <div 
          className={cn(
            'absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-to-r from-cyan-400/20 to-purple-600/20 rounded-full',
            'transition-all duration-[5000ms] ease-out delay-1000',
            isLoaded ? 'animate-ping' : ''
          )}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto">
        
        {/* Title with staggered animation */}
        <h1 
          className={cn(
            'text-6xl md:text-8xl font-black mb-6 text-transparent bg-clip-text',
            'bg-gradient-to-r from-white via-cyan-400 to-purple-400',
            'transition-all duration-1000 ease-out',
            isLoaded 
              ? 'opacity-100 transform translate-y-0 scale-100' 
              : 'opacity-0 transform translate-y-8 scale-95'
          )}
          style={{
            textShadow: '0 0 40px rgba(6, 182, 212, 0.3)',
          }}
        >
          {title.split('').map((char, i) => (
            <span
              key={i}
              className={cn(
                'inline-block transition-all duration-700 ease-out hover:scale-110 hover:text-cyan-300',
                isLoaded ? '' : 'transform translate-y-8'
              )}
              style={{
                animationDelay: `${i * 100}ms`,
                animation: isLoaded ? 'slideInUp 0.7s ease-out forwards' : '',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p 
          className={cn(
            'text-xl md:text-2xl font-light text-gray-300 mb-8 max-w-2xl leading-relaxed',
            'transition-all duration-1000 ease-out delay-500',
            isLoaded 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-6'
          )}
        >
          {subtitle}
        </p>

        {/* CTA Button */}
        <button
          onClick={onCTAClick}
          className={cn(
            'group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600',
            'text-white font-semibold rounded-full transition-all duration-300 ease-out',
            'hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25',
            'before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-cyan-400 before:to-purple-500',
            'before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100',
            'transform-gpu',
            isLoaded 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          )}
          style={{
            transitionDelay: isLoaded ? '800ms' : '0ms',
          }}
        >
          <span className="relative z-10 flex items-center gap-2">
            {ctaText}
            <svg 
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </button>

        {/* Scroll indicator */}
        <div 
          className={cn(
            'absolute bottom-8 left-1/2 transform -translate-x-1/2',
            'transition-all duration-1000 ease-out delay-1000',
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <div className="flex flex-col items-center text-gray-400">
            <span className="text-sm mb-2 tracking-wider uppercase">Scroll</span>
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Animated border glow */}
      <div className="absolute inset-0 border border-gradient-to-r from-cyan-400/20 via-transparent to-purple-400/20 pointer-events-none" />
      
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(2rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}