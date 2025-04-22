"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import QRCode from "react-qr-code"

interface PixQRCodeProps {
  value: number
  pixCode: string
}

export function PixQRCode({ value, pixCode }: PixQRCodeProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pixCode)
    setCopied(true)
    toast({
      title: "Chave PIX copiada!",
      description: "A chave PIX foi copiada para a área de transferência.",
      variant: "success",
    })
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <Card className="w-full max-w-md mx-auto border-2 border-green-200 dark:border-green-800">
      <CardContent className="p-6 flex flex-col items-center">
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold">Pague com PIX</h3>
          <p className="text-base text-muted-foreground">Escaneie o QR Code ou copie a chave PIX</p>
          <p className="font-bold mt-2 text-xl text-green-600">
            R$ {value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg mb-4 border-2 border-green-100">
          <QRCode value={pixCode} size={200} bgColor={"#FFFFFF"} fgColor={"#000000"} level={"H"} className="mx-auto" />
        </div>

        <div className="w-full">
          <div className="flex items-center justify-between p-4 bg-muted rounded-md mb-4 border">
            <div className="truncate max-w-[200px] text-base font-mono">{pixCode.substring(0, 20)}...</div>
            <Button
              variant={copied ? "success" : "outline"}
              size="sm"
              onClick={copyToClipboard}
              className={`ml-2 ${copied ? "bg-green-600 text-white" : "border-green-600 text-green-600 hover:bg-green-50"}`}
            >
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copiado!" : "Copiar"}
            </Button>
          </div>

          <div className="text-sm text-muted-foreground space-y-1">
            <p className="flex items-center">
              <Check className="h-4 w-4 mr-2 text-green-600" />O pagamento será confirmado em até 5 minutos
            </p>
            <p className="flex items-center">
              <Check className="h-4 w-4 mr-2 text-green-600" />O valor será creditado automaticamente na sua conta
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
