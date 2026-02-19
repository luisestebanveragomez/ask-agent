import React, { useState, useMemo } from 'react'

import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

import ResumeAssistant from '@/components/ResumeAssistant'

export const Route = createFileRoute('/')({
  component: App,
})

// Temporary fallback data
const allJobs = [
  {
    jobTitle: 'Senior Frontend Developer',
    company: 'Tech Company',
    location: 'Remote',
    startDate: '2023',
    endDate: null,
    summary: 'Building amazing user experiences with modern technologies',
    tags: ['React', 'TypeScript', 'Next.js', 'TailwindCSS'],
    content: 'Working on cutting-edge web applications...',
  },
]

const allEducations = [
  {
    school: 'University of Technology',
    summary: 'Computer Science degree with focus on web development',
    content: 'Comprehensive study of computer science fundamentals...',
  },
]

// Epic Forest Story with Horse Animation + PARALLAX
function ForestStoryHero() {
  const scrollToContent = () => {
    const contentElement = document.getElementById('main-content')
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Parallax effect on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset
      const parallax = document.querySelectorAll('.parallax')
      const speed = 0.5

      parallax.forEach((element) => {
        const rate = scrolled * -speed
        ;(element as HTMLElement).style.transform = `translateY(${rate}px)`
      })

      // Different speeds for different layers
      const parallaxSlow = document.querySelectorAll('.parallax-slow')
      parallaxSlow.forEach((element) => {
        const rate = scrolled * -0.2
        ;(element as HTMLElement).style.transform = `translateY(${rate}px)`
      })

      const parallaxFast = document.querySelectorAll('.parallax-fast')
      parallaxFast.forEach((element) => {
        const rate = scrolled * -0.8
        ;(element as HTMLElement).style.transform = `translateY(${rate}px)`
      })

      const parallaxReverse = document.querySelectorAll('.parallax-reverse')
      parallaxReverse.forEach((element) => {
        const rate = scrolled * 0.3
        ;(element as HTMLElement).style.transform = `translateY(${rate}px)`
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative overflow-hidden">
      {/* FASE 1: Inicio del sendero */}
      <section className="relative h-screen bg-gradient-to-b from-emerald-900 via-green-800 to-green-700 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 w-full h-96">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className={`absolute bottom-0 bg-green-950/70 rounded-t-full ${
                  i < 7
                    ? 'parallax-slow'
                    : i < 14
                      ? 'parallax'
                      : 'parallax-fast'
                }`}
                style={{
                  left: `${i * 5 + Math.sin(i * 0.8) * 10}%`,
                  width: `${30 + Math.cos(i * 1.2) * 12}px`,
                  height: `${100 + Math.sin(i * 1.5) * 30}px`,
                  animation: `sway 10s ease-in-out infinite ${i * 0.2}s`,
                  filter: 'blur(2px)',
                  zIndex: 1,
                }}
              />
            ))}
          </div>

          <div className="absolute inset-0">
            {Array.from({ length: 15 }, (_, i) => (
              <div
                key={i}
                className={`absolute w-1 h-1 bg-yellow-200 rounded-full ${
                  i % 3 === 0 ? 'parallax-reverse' : 'parallax-fast'
                }`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animation: `magicalFloat 6s ease-in-out infinite ${i * 0.3}s`,
                  opacity: 0.8,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center h-full text-white px-4">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
              El Sendero
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Un joven camina por el bosque encantado...
            </p>
          </div>
        </div>
      </section>

      {/* FASE 2: Caminando por el bosque */}
      <section className="relative h-screen bg-gradient-to-b from-green-700 via-green-600 to-emerald-600 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 w-full h-full">
            {Array.from({ length: 25 }, (_, i) => (
              <div
                key={i}
                className={`absolute bottom-0 bg-green-800 rounded-t-full ${
                  i < 8
                    ? 'parallax-slow'
                    : i < 16
                      ? 'parallax'
                      : 'parallax-fast'
                }`}
                style={{
                  left: `${i * 4 + Math.sin(i * 1.2) * 15}%`,
                  width: `${50 + Math.cos(i * 0.9) * 25}px`,
                  height: `${150 + Math.sin(i * 1.8) * 50}px`,
                  animation: `forestMove 8s ease-in-out infinite ${i * 0.1}s`,
                  transform: `scale(${0.8 + Math.sin(i) * 0.3})`,
                  zIndex: (i % 3) + 1,
                }}
              />
            ))}
          </div>

          {/* Silueta del joven caminando */}
          <div className="absolute bottom-32 left-1/3 w-8 h-16 transform -translate-x-1/2 parallax-reverse">
            <div className="w-full h-full bg-black rounded-full opacity-70 animate-walkBounce" />
          </div>

          {/* Rayos de sol */}
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className={`absolute bg-gradient-to-b from-yellow-300/20 to-transparent ${
                i % 2 === 0 ? 'parallax-slow' : 'parallax-fast'
              }`}
              style={{
                left: `${20 + i * 15}%`,
                top: '0',
                width: '4px',
                height: '100%',
                animation: `lightFilter 12s ease-in-out infinite ${i * 2}s`,
                transform: `rotate(${-10 + i * 5}deg)`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex items-center justify-end h-full text-white px-4 pr-16">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-yellow-200">
              La Búsqueda
            </h2>
            <p className="text-lg text-green-100">
              Entre las sombras algo se mueve...
            </p>
          </div>
        </div>
      </section>

      {/* FASE 3: El Descubrimiento */}
      <section className="relative h-screen bg-gradient-to-b from-emerald-600 via-emerald-500 to-teal-500 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 w-full h-full">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className={`absolute bottom-0 bg-emerald-700 rounded-t-full ${
                  i < 4 ? 'parallax-slow' : i < 8 ? 'parallax' : 'parallax-fast'
                }`}
                style={{
                  left: i < 6 ? `${i * 8}%` : `${50 + (i - 6) * 8}%`,
                  width: `${70 + Math.cos(i) * 20}px`,
                  height: `${200 + Math.sin(i * 2) * 60}px`,
                  animation: `treeSeparate 10s ease-in-out infinite ${i * 0.4}s`,
                  zIndex: 2,
                }}
              />
            ))}
          </div>

          {/* Primera aparición sutil del caballo */}
          <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 parallax-reverse">
            <div className="w-20 h-12 opacity-0 animate-horseEmerge bg-gradient-to-r from-amber-800 to-amber-600 rounded-lg" />
          </div>

          {/* Más partículas mágicas */}
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-amber-300 rounded-full ${
                i % 4 === 0
                  ? 'parallax-reverse'
                  : i % 2 === 0
                    ? 'parallax-fast'
                    : 'parallax'
              }`}
              style={{
                left: `${30 + Math.random() * 40}%`,
                top: `${30 + Math.random() * 40}%`,
                animation: `magicalFloat 4s ease-in-out infinite ${i * 0.2}s`,
                opacity: 0.6 + Math.random() * 0.4,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex items-center justify-center h-full text-white px-4">
          <div className="text-center">
            <h2 className="text-5xl md:text-7xl font-bold mb-4 text-amber-200">
              El Encuentro
            </h2>
            <p className="text-xl text-teal-100">
              Entre los árboles, una silueta misteriosa...
            </p>
          </div>
        </div>
      </section>

      {/* FASE 4: La Revelación del Caballo */}
      <section className="relative h-screen bg-gradient-to-b from-teal-500 via-cyan-400 to-blue-400 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 w-full h-96">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className={`absolute bottom-0 bg-teal-800 rounded-t-full ${
                  i < 3 ? 'parallax-slow' : i < 6 ? 'parallax' : 'parallax-fast'
                }`}
                style={{
                  left: i < 4 ? `${i * 15}%` : `${60 + (i - 4) * 10}%`,
                  width: `${60 + Math.cos(i) * 15}px`,
                  height: `${180 + Math.sin(i) * 40}px`,
                  animation: `sway 6s ease-in-out infinite ${i * 0.5}s`,
                  zIndex: 1,
                }}
              />
            ))}
          </div>

          {/* EL CABALLO - Aparición dramática */}
          <div className="absolute bottom-36 left-1/2 transform -translate-x-1/2 animate-horseReveal parallax-reverse">
            <div className="relative">
              {/* Cuerpo del caballo */}
              <div className="w-24 h-16 bg-gradient-to-r from-amber-800 to-amber-600 rounded-lg shadow-lg" />
              {/* Cabeza */}
              <div className="absolute -top-6 left-16 w-12 h-12 bg-gradient-to-r from-amber-700 to-amber-500 rounded-lg" />
              {/* Crin */}
              <div className="absolute -top-4 left-12 w-16 h-8 bg-gradient-to-r from-amber-900 to-amber-700 rounded-full opacity-80" />
              {/* Patas */}
              {[0, 6, 12, 18].map((offset, i) => (
                <div
                  key={i}
                  className="absolute top-12 bg-amber-700 w-2 h-8 rounded-full"
                  style={{ left: `${4 + offset}px` }}
                />
              ))}
            </div>
          </div>

          {/* Joven observando */}
          <div className="absolute bottom-32 left-1/4 w-6 h-12 bg-black rounded-full opacity-60 parallax-reverse" />

          {/* Luz mágica envolvente */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-amber-200/10 to-transparent animate-pulse parallax-slow" />

          {/* Partículas doradas */}
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-yellow-400 rounded-full shadow-sm shadow-yellow-400 ${
                i % 5 === 0
                  ? 'parallax-reverse'
                  : i % 3 === 0
                    ? 'parallax-fast'
                    : 'parallax'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `goldenFloat 5s ease-in-out infinite ${i * 0.1}s`,
                opacity: 0.8,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex items-center justify-start h-full text-white px-8">
          <div className="text-left">
            <h2 className="text-6xl md:text-8xl font-bold mb-4 text-amber-200">
              Magia
            </h2>
            <p className="text-2xl text-blue-100">
              El caballo emerge de la bruma...
            </p>
          </div>
        </div>
      </section>

      {/* FASE 5: La Conexión Final */}
      <section className="relative h-screen bg-gradient-to-b from-blue-400 via-purple-400 to-indigo-500 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 w-full h-80">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className={`absolute bottom-0 bg-indigo-800 rounded-t-full opacity-80 ${
                  i < 4 ? 'parallax-slow' : i < 7 ? 'parallax' : 'parallax-fast'
                }`}
                style={{
                  left: `${i * 10}%`,
                  width: `${40 + Math.cos(i) * 10}px`,
                  height: `${120 + Math.sin(i) * 20}px`,
                  animation: `gentleSway 12s ease-in-out infinite ${i * 0.8}s`,
                }}
              />
            ))}
          </div>

          {/* Caballo y joven juntos */}
          <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 animate-finalConnection parallax-reverse">
            <div className="relative opacity-90">
              <div className="w-20 h-14 bg-gradient-to-r from-purple-300 to-purple-100 rounded-lg shadow-xl" />
              <div className="absolute -top-4 left-14 w-10 h-10 bg-gradient-to-r from-purple-200 to-white rounded-lg" />
              <div className="absolute -top-2 left-10 w-12 h-6 bg-gradient-to-r from-purple-400 to-purple-200 rounded-full" />
            </div>
            <div className="absolute left-28 top-2 w-5 h-10 bg-indigo-900 rounded-full opacity-70" />
          </div>

          {/* Aurora mágica */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-purple-300/20 to-pink-300/20 animate-aurora parallax-slow" />
        </div>

        <div className="relative z-10 flex items-center justify-center h-full text-white px-4">
          <div className="text-center">
            <h2 className="text-7xl md:text-9xl font-bold mb-6 bg-gradient-to-r from-purple-200 via-pink-200 to-white bg-clip-text text-transparent">
              Unión
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Dos almas se encuentran en el bosque eterno
            </p>
            <button
              onClick={scrollToContent}
              className="group px-12 py-6 bg-white/20 backdrop-blur-xl border border-white/40 rounded-full text-white font-bold hover:bg-white/30 transition-all duration-500 shadow-2xl transform hover:scale-110 hover:-translate-y-3"
            >
              <span className="flex items-center gap-4 text-xl">
                <span className="animate-pulse">✨</span>
                Continúa la Historia
                <svg
                  className="w-7 h-7 group-hover:translate-x-3 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* CSS Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes sway {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(5px) rotate(1deg); }
        }
        
        @keyframes forestMove {
          0%, 100% { transform: translateX(0) scale(1); }
          50% { transform: translateX(-3px) scale(1.02); }
        }
        
        @keyframes walkBounce {
          0%, 50%, 100% { transform: translateY(0) scaleY(1); }
          25%, 75% { transform: translateY(-2px) scaleY(1.1); }
        }
        
        @keyframes lightFilter {
          0%, 100% { opacity: 0.2; transform: rotate(0deg) translateX(0); }
          50% { opacity: 0.6; transform: rotate(0deg) translateX(8px); }
        }
        
        @keyframes treeSeparate {
          0%, 100% { transform: translateX(0) scale(1); }
          50% { transform: translateX(15px) scale(1.05); }
        }
        
        @keyframes horseEmerge {
          0%, 60% { opacity: 0; transform: scale(0) translateY(20px); }
          80% { opacity: 0.5; transform: scale(0.8) translateY(10px); }
          100% { opacity: 0.7; transform: scale(1) translateY(0); }
        }
        
        @keyframes horseReveal {
          0% { opacity: 0; transform: scale(0.5) translateY(50px); }
          50% { opacity: 0.8; transform: scale(1.1) translateY(-5px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        @keyframes finalConnection {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.02); }
        }
        
        @keyframes gentleSway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(0.5deg); }
        }
        
        @keyframes aurora {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        
        @keyframes magicalFloat {
          0%, 100% { 
            opacity: 0.3; 
            transform: translateY(0px) scale(1); 
          }
          25% { 
            opacity: 1; 
            transform: translateY(-20px) scale(1.5); 
          }
          75% { 
            opacity: 0.8; 
            transform: translateY(-10px) scale(1.2); 
          }
        }
        
        @keyframes goldenFloat {
          0%, 100% { 
            opacity: 0.4; 
            transform: translateY(0px) translateX(0px) scale(1); 
          }
          33% { 
            opacity: 1; 
            transform: translateY(-15px) translateX(10px) scale(2); 
          }
          66% { 
            opacity: 0.7; 
            transform: translateY(-25px) translateX(-5px) scale(1.5); 
          }
        }
        
        .bg-gradient-radial {
          background: radial-gradient(ellipse at center, var(--tw-gradient-stops));
        }
      `,
        }}
      />
    </div>
  )
}

function App() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    allJobs.forEach((job: any) => {
      job.tags.forEach((tag: string) => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [])

  const filteredJobs = useMemo(() => {
    if (selectedTags.length === 0) return allJobs
    return allJobs.filter((job: any) =>
      selectedTags.some((tag) => job.tags.includes(tag)),
    )
  }, [selectedTags])

  return (
    <>
      <ResumeAssistant />

      {/* Epic Forest Story Hero Section */}
      <ForestStoryHero />

      {/* Main Content */}
      <div
        id="main-content"
        className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100"
      >
        <div className="flex">
          <div className="w-72 min-h-screen bg-white border-r shadow-sm p-8 sticky top-0">
            <h3 className="text-lg font-semibold mb-6 text-gray-900">
              Skills & Technologies
            </h3>
            <div className="space-y-4">
              {allTags.map((tag) => (
                <div key={tag} className="flex items-center space-x-3 group">
                  <Checkbox
                    id={tag}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={(checked: any) => {
                      if (checked) {
                        setSelectedTags([...selectedTags, tag])
                      } else {
                        setSelectedTags(selectedTags.filter((t) => t !== tag))
                      }
                    }}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <label
                    htmlFor={tag}
                    className="text-sm font-medium leading-none text-gray-700 group-hover:text-gray-900 transition-colors cursor-pointer"
                  >
                    {tag}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 p-8 lg:p-12">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  My Resume
                </h1>
                <p className="text-gray-600 text-lg">
                  Professional Experience & Education
                </p>
                <Separator className="mt-8" />
              </div>

              <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">
                    Career Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-8">
                    <p className="text-gray-700 flex-1 leading-relaxed">
                      I am a passionate and driven professional seeking
                      opportunities that will leverage my extensive experience
                      in frontend development while providing continuous growth
                      and learning opportunities.
                    </p>
                    <img
                      src="/headshot-on-white.jpg"
                      alt="Professional headshot"
                      className="w-44 h-52 rounded-2xl object-cover shadow-md transition-transform hover:scale-105"
                    />
                  </div>
                </CardContent>
              </Card>

              <section className="space-y-6">
                <h2 className="text-3xl font-semibold text-gray-900">
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {filteredJobs.map((job: any) => (
                    <Card
                      key={job.jobTitle}
                      className="border-0 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <CardTitle className="text-xl text-gray-900">
                              {job.jobTitle}
                            </CardTitle>
                            <p className="text-blue-600 font-medium">
                              {job.company} - {job.location}
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-sm">
                            {job.startDate} - {job.endDate || 'Present'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                          {job.summary}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {job.tags.map((tag: string) => (
                            <HoverCard key={tag}>
                              <HoverCardTrigger>
                                <Badge
                                  variant="outline"
                                  className="hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                  {tag}
                                </Badge>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-64">
                                <p className="text-sm text-gray-600">
                                  Experience with {tag} in professional
                                  development
                                </p>
                              </HoverCardContent>
                            </HoverCard>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-3xl font-semibold text-gray-900">
                  Education
                </h2>
                <div className="space-y-6">
                  {allEducations.map((education: any) => (
                    <Card
                      key={education.school}
                      className="border-0 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <CardTitle className="text-xl text-gray-900">
                          {education.school}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 leading-relaxed">
                          {education.summary}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
