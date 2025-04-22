"use client"

import { useEffect, useRef } from "react"

interface ConfettiCelebrationProps {
  isActive: boolean
  onComplete?: () => void
}

export function ConfettiCelebration({ isActive, onComplete }: ConfettiCelebrationProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hasPlayedRef = useRef(false)
  const confettiRef = useRef<any>(null)

  // Carregar confetti sob demanda para evitar problemas de desempenho
  useEffect(() => {
    if (isActive && !confettiRef.current) {
      import("canvas-confetti")
        .then((module) => {
          confettiRef.current = module.default
        })
        .catch((error) => {
          console.error("Erro ao carregar canvas-confetti:", error)
        })
    }
  }, [isActive])

  // Pré-carregar o áudio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/win-sound.mp3")
      audioRef.current.preload = "auto"
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [])

  // Executar a animação quando isActive mudar para true
  useEffect(() => {
    if (isActive && !hasPlayedRef.current) {
      hasPlayedRef.current = true

      // Tocar o som
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0

        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Erro ao reproduzir som:", error)
          })
        }
      }

      // Função para lançar confetes
      const launchConfetti = () => {
        if (!confettiRef.current) return

        const duration = 3000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now()

          if (timeLeft <= 0) {
            clearInterval(interval)
            hasPlayedRef.current = false
            if (onComplete) onComplete()
            return
          }

          const particleCount = 50 * (timeLeft / duration)

          // Lançar confetes de diferentes posições
          confettiRef.current({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          })

          confettiRef.current({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          })
        }, 250)
      }

      // Iniciar a animação de confetes
      try {
        if (confettiRef.current) {
          launchConfetti()
        } else {
          // Se o confetti ainda não foi carregado, tentar novamente em 100ms
          const checkInterval = setInterval(() => {
            if (confettiRef.current) {
              clearInterval(checkInterval)
              launchConfetti()
            }
          }, 100)

          // Limpar o intervalo após 2 segundos se o confetti não carregar
          setTimeout(() => {
            clearInterval(checkInterval)
            hasPlayedRef.current = false
            if (onComplete) onComplete()
          }, 2000)
        }
      } catch (error) {
        console.error("Erro ao lançar confetes:", error)
        hasPlayedRef.current = false
        if (onComplete) onComplete()
      }
    } else if (!isActive) {
      hasPlayedRef.current = false
    }
  }, [isActive, onComplete])

  // Não renderizar nada no DOM
  return null
}
