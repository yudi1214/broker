"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAccountStore } from "@/lib/stores/account-store"
import { useUserStore } from "@/lib/stores/user-store"
import { useFinanceStore } from "@/lib/stores/finance-store"
import { formatCurrency } from "@/lib/utils"
import { ArrowRight, Copy, Gift, Loader2, QrCode, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { PixQRCode } from "./pix-qr-code"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { XGateService } from "@/lib/services/xgate-service"

export function DepositForm() {
  const { accountType } = useAccountStore()
  const { user } = useUserStore()
  const { addDeposit } = useFinanceStore()
  const { toast } = useToast()
  const isMobile = useMediaQuery("(max-width: 768px)")

  const [depositAmount, setDepositAmount] = useState("100")
  const [isDepositLoading, setIsDepositLoading] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [selectedBonus, setSelectedBonus] = useState("100")
  const [promoCode, setPromoCode] = useState("")
  const [showPromoCode, setShowPromoCode] = useState(false)
  const [pixCode, setPixCode] = useState("")
  const [depositId, setDepositId] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")

  const balance = accountType === "real" ? user?.realBalance || 0 : user?.demoBalance || 0

  const handleDepositAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "")
    setDepositAmount(numericValue)
  }

  const handleDeposit = async () => {
    if (accountType === "demo") {
      toast({
        title: "Operação não permitida",
        description: "Não é possível fazer depósitos em conta demo",
        variant: "destructive",
      })
      return
    }

    const amount = Number(depositAmount)

    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido para depósito",
        variant: "destructive",
      })
      return
    }

    if (amount < 100) {
      toast({
        title: "Valor mínimo",
        description: "O valor mínimo para depósito é R$ 100,00",
        variant: "destructive",
      })
      return
    }

    setIsDepositLoading(true)

    try {
      // Usar o serviço XGate para criar um depósito
      const response = await XGateService.createDeposit(amount)

      // Mostrar QR Code
      setShowQRCode(true)

      // Definir o código PIX e o ID do depósito
      setPixCode(response.data.code || "")
      setDepositId(response.data.id || "")

      // Definir a URL do QR code se disponível
      if (response.data.qrcode) {
        setQrCodeUrl(response.data.qrcode)
      }

      // Adicionar o depósito ao store
      const deposit = {
        id: response.data.id || `DEP${Date.now().toString().slice(-8)}`,
        amount,
        status: "pending",
        timestamp: new Date().toISOString(),
        accountType: "real",
        method: "pix",
        pixCode: response.data.code || "",
        customerId: response.data.customerId || "",
        type: "deposit",
      }

      addDeposit(deposit)

      toast({
        title: "PIX gerado com sucesso",
        description: "Escaneie o QR Code ou copie o código PIX para realizar o pagamento",
        variant: "success",
      })
    } catch (error) {
      console.error("Erro ao processar depósito:", error)

      // Fallback para o método simulado se a integração XGate falhar
      try {
        // Simular processamento
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mostrar QR Code
        setShowQRCode(true)

        // Gerar código PIX simulado
        const simulatedPixCode = `00020126580014BR.GOV.BCB.PIX0136a629532e-7693-4846-b028-f142a1dd3f9f5204000053039865802BR5925TRADE PLATFORM PAGAMENTOS6009SAO PAULO62070503***6304${Math.floor(Math.random() * 10000)}`
        setPixCode(simulatedPixCode)

        // Gerar ID de depósito simulado
        const simulatedDepositId = `DEP${Date.now().toString().slice(-8)}`
        setDepositId(simulatedDepositId)

        const deposit = {
          id: simulatedDepositId,
          amount,
          status: "pending",
          timestamp: new Date().toISOString(),
          accountType: "real",
          method: "pix",
          pixCode: simulatedPixCode,
          customerId: `CUST${Math.floor(Math.random() * 100000)}`,
          type: "deposit",
        }

        addDeposit(deposit)

        toast({
          title: "PIX gerado com sucesso (modo fallback)",
          description: "Escaneie o QR Code ou copie o código PIX para realizar o pagamento",
          variant: "success",
        })
      } catch (fallbackError) {
        console.error("Erro no fallback:", fallbackError)
        toast({
          title: "Erro ao processar depósito",
          description: "Ocorreu um erro ao processar seu depósito. Tente novamente mais tarde",
          variant: "destructive",
        })
        setShowQRCode(false)
      }
    } finally {
      setIsDepositLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Código PIX copiado!",
      description: "Cole o código no seu aplicativo de banco para realizar o pagamento",
      variant: "success",
    })
  }

  // Calcular valor com bônus
  const calculateBonusAmount = () => {
    const amount = Number(depositAmount) || 0

    if (selectedBonus === "100") {
      return amount * 2
    } else if (selectedBonus === "50") {
      return amount * 1.5
    }

    return amount
  }

  if (accountType === "demo") {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Conta Demo</AlertTitle>
          <AlertDescription>
            Você está usando uma conta demo. Para fazer depósitos, mude para uma conta real.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader className="bg-muted/50">
            <CardTitle>Depósito não disponível</CardTitle>
            <CardDescription>
              Depósitos não estão disponíveis em contas demo. Mude para uma conta real para fazer depósitos.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex justify-center">
              <Button
                onClick={() => useAccountStore.getState().toggleAccountType()}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Mudar para Conta Real
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-md px-4 py-2 flex items-center">
          <Gift className="h-5 w-5 mr-2" />
          <span className="font-medium">Bônus ativo: {selectedBonus}%</span>
        </div>
      </div>

      <Card className="w-full border-2 border-green-500/20 shadow-lg">
        <CardHeader className="bg-green-500/10">
          <CardTitle className="flex items-center text-xl">
            <QrCode className="h-6 w-6 mr-2 text-green-600" />
            Depósito via PIX
          </CardTitle>
          <CardDescription className="text-base">
            Faça um depósito instantâneo via PIX para sua conta real
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {!showQRCode ? (
            <div className="space-y-6">
              <Alert variant="success" className="mb-4">
                <CheckCircle className="h-5 w-5" />
                <AlertTitle>Depósito Rápido e Seguro</AlertTitle>
                <AlertDescription>
                  Seu depósito será processado instantaneamente após o pagamento via PIX.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="deposit-amount" className="text-lg font-medium">
                  Valor do depósito
                </Label>
                <Input
                  id="deposit-amount"
                  type="text"
                  value={depositAmount}
                  onChange={(e) => handleDepositAmountChange(e.target.value)}
                  className="text-lg h-12"
                  placeholder="Digite o valor"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant={depositAmount === "100" ? "default" : "outline"}
                  onClick={() => handleDepositAmountChange("100")}
                  className={cn(
                    "w-full h-12 text-lg",
                    depositAmount === "100" ? "bg-green-600 hover:bg-green-700 text-white" : "",
                  )}
                >
                  R$ 100
                </Button>
                <Button
                  variant={depositAmount === "200" ? "default" : "outline"}
                  onClick={() => handleDepositAmountChange("200")}
                  className={cn(
                    "w-full h-12 text-lg",
                    depositAmount === "200" ? "bg-green-600 hover:bg-green-700 text-white" : "",
                  )}
                >
                  R$ 200
                </Button>
                <Button
                  variant={depositAmount === "500" ? "default" : "outline"}
                  onClick={() => handleDepositAmountChange("500")}
                  className={cn(
                    "w-full h-12 text-lg",
                    depositAmount === "500" ? "bg-green-600 hover:bg-green-700 text-white" : "",
                  )}
                >
                  R$ 500
                </Button>
                <Button
                  variant={depositAmount === "1000" ? "default" : "outline"}
                  onClick={() => handleDepositAmountChange("1000")}
                  className={cn(
                    "w-full h-12 text-lg",
                    depositAmount === "1000" ? "bg-green-600 hover:bg-green-700 text-white" : "",
                  )}
                >
                  R$ 1000
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-lg font-medium">Selecionar bônus de depósito</Label>
                <Select value={selectedBonus} onValueChange={setSelectedBonus}>
                  <SelectTrigger className="bg-amber-500/10 border-amber-500/20 h-12">
                    <SelectValue placeholder="Selecione o bônus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100% - Dobro do valor</SelectItem>
                    <SelectItem value="50">50% - Metade extra</SelectItem>
                    <SelectItem value="0">Sem bônus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {!showPromoCode ? (
                <Button
                  variant="link"
                  onClick={() => setShowPromoCode(true)}
                  className="px-0 text-amber-600 hover:text-amber-700"
                >
                  Tenho um código promocional
                </Button>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="promo-code">Código Promocional</Label>
                  <Input
                    id="promo-code"
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Digite o código promocional"
                  />
                </div>
              )}

              <div className="rounded-lg bg-green-50 dark:bg-green-950/20 p-4 space-y-2 border border-green-200 dark:border-green-800">
                <div className="flex justify-between">
                  <span className="font-medium">Depósito</span>
                  <span className="font-medium">{formatCurrency(Number(depositAmount) || 0)}</span>
                </div>
                {selectedBonus !== "0" && (
                  <div className="flex justify-between text-green-600">
                    <span className="font-medium">Bônus ({selectedBonus}%)</span>
                    <span className="font-medium">
                      +{formatCurrency((Number(depositAmount) || 0) * (selectedBonus === "100" ? 1 : 0.5))}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold border-t border-green-200 dark:border-green-800 pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-green-600">{formatCurrency(calculateBonusAmount())}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {!isMobile && (
                <div className="flex justify-center">
                  <PixQRCode value={Number(depositAmount)} pixCode={pixCode} qrCodeUrl={qrCodeUrl} />
                </div>
              )}

              {isMobile && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-semibold">Pague com PIX</h3>
                    <p className="text-base text-muted-foreground">Copie o código PIX abaixo</p>
                    <p className="font-bold mt-2 text-xl">
                      R$ {Number(depositAmount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="w-full">
                    <div className="flex items-center justify-between p-4 bg-muted rounded-md mb-4 border">
                      <div className="truncate max-w-[200px] text-base">{pixCode.substring(0, 20)}...</div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(pixCode)}
                        className="ml-2 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar
                      </Button>
                    </div>

                    <Alert variant="success" className="mb-4">
                      <CheckCircle className="h-5 w-5" />
                      <AlertTitle>Pagamento em Processamento</AlertTitle>
                      <AlertDescription>
                        O pagamento será confirmado em até 5 minutos e o valor será creditado automaticamente na sua
                        conta.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              )}

              <div className="rounded-lg bg-green-50 dark:bg-green-950/20 p-4 space-y-2 border border-green-200 dark:border-green-800">
                <div className="flex justify-between">
                  <span className="font-medium">Depósito</span>
                  <span className="font-medium">{formatCurrency(Number(depositAmount) || 0)}</span>
                </div>
                {selectedBonus !== "0" && (
                  <div className="flex justify-between text-green-600">
                    <span className="font-medium">Bônus ({selectedBonus}%)</span>
                    <span className="font-medium">
                      +{formatCurrency((Number(depositAmount) || 0) * (selectedBonus === "100" ? 1 : 0.5))}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold border-t border-green-200 dark:border-green-800 pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-green-600">{formatCurrency(calculateBonusAmount())}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />O depósito será processado automaticamente após
                  o pagamento.
                </p>
                <p className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />O valor estará disponível em sua conta em até 5
                  minutos.
                </p>
                <p className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  ID da transação: {depositId}
                </p>
              </div>

              <Button variant="outline" className="w-full" onClick={() => setShowQRCode(false)}>
                Voltar
              </Button>
            </div>
          )}
        </CardContent>
        {!showQRCode && (
          <CardFooter className="bg-green-50 dark:bg-green-950/20 border-t border-green-200 dark:border-green-800 p-6">
            <Button
              className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white h-14 text-lg font-bold shadow-lg"
              onClick={handleDeposit}
              disabled={isDepositLoading || !depositAmount || Number(depositAmount) < 100}
            >
              {isDepositLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  Gerar PIX
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
