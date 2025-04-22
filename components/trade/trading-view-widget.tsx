"use client"

import { useEffect, useRef, useState, memo } from "react"

interface TradingViewWidgetProps {
  symbol: string
  interval?: string
  theme?: "light" | "dark"
  width?: string | number
  height?: string | number
}

declare global {
  interface Window {
    TradingView: any
  }
}

// Memoizar o componente para evitar re-renderizações desnecessárias
const TradingViewWidget = memo(function TradingViewWidget({
  symbol,
  interval = "1",
  theme = "light",
  width = "100%",
  height = "100%",
}: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  const widgetRef = useRef<any>(null)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [widgetId] = useState(`tradingview_${Math.random().toString(36).substring(2, 9)}`)

  // Carregar o script do TradingView apenas uma vez
  useEffect(() => {
    if (!containerRef.current) return

    if (!scriptRef.current) {
      const script = document.createElement("script")
      script.src = "https://s3.tradingview.com/tv.js"
      script.async = true
      script.onload = () => {
        setIsScriptLoaded(true)
      }
      scriptRef.current = script
      document.head.appendChild(script)
    }

    return () => {
      // Não remover o script ao desmontar para evitar recarregamentos desnecessários
      // Apenas limpar o widget se existir
      if (widgetRef.current) {
        try {
          widgetRef.current = null
        } catch (error) {
          console.error("Erro ao limpar widget:", error)
        }
      }
    }
  }, [])

  // Criar ou atualizar o widget quando o símbolo mudar
  useEffect(() => {
    if (!isScriptLoaded || !containerRef.current || !window.TradingView) return

    // Limpar o container antes de criar um novo widget
    if (containerRef.current) {
      containerRef.current.innerHTML = ""
    }

    try {
      // Determinar o símbolo correto para o TradingView
      const tvSymbol = symbol.includes(":") ? symbol : `BINANCE:${symbol}`

      // Criar o widget com configurações otimizadas
      widgetRef.current = new window.TradingView.widget({
        autosize: true,
        symbol: tvSymbol,
        interval,
        timezone: "Etc/UTC",
        theme: theme,
        style: "1",
        locale: "br",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        container_id: widgetId,
        hide_volume: false,
        // Configurações para melhorar o desempenho
        loading_screen: { backgroundColor: "#f4f4f4", foregroundColor: "#2962FF" },
        disabled_features: ["use_localstorage_for_settings"],
        enabled_features: ["move_logo_to_main_pane"],
      })
    } catch (error) {
      console.error("Erro ao criar widget TradingView:", error)
    }
  }, [symbol, interval, theme, isScriptLoaded, widgetId])

  return <div ref={containerRef} id={widgetId} style={{ width, height }} className="rounded-lg overflow-hidden" />
})

export { TradingViewWidget }
