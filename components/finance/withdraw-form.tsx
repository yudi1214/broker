"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAccountStore } from "@/lib/stores/account-store"
import { useUserStore } from "@/lib/stores/user-store"
import { useFinanceStore } from "@/lib/stores/finance-store"
import { ArrowUpFromLine, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function WithdrawForm() {
  const { accountType } = useAccountStore()
  const { user } = useUserStore()
  const { addWithdrawal } = useFinanceStore()
  const { toast } = useToast()

  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [pixKeyType, setPixKeyType] = useState("cpf")
  const [pixKey, setPixKey] = useState("")
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false)

  const balance = accountType === "real" ? user?.realBalance || 0 : user?.demoBalance || 0

  const handleWithdrawAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "")
    setWithdrawAmount(numericValue)
  }

  const handleWithdraw = async () => {
    if (accountType === "demo") {
      toast({
        title: "Operação não permitida",
        description: "Não é possível fazer saques em conta demo",
        variant: "destructive",
      })
      return
    }

    const amount = Number(withdrawAmount)

    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido para saque",
        variant: "destructive",
      })
      return
    }

    if (amount > balance) {
      toast({
        title: "Saldo insuficiente",
        description: "Você não tem saldo suficiente para este saque",
        variant: "destructive",
      })
      return
    }

    if (amount < 50) {
      toast({
        title: "Valor mínimo",
        description: "O valor mínimo para saque é R$ 50,00",
        variant: "destructive",
      })
      return
    }

    if (!pixKey.trim()) {
      toast({
        title: "Chave PIX inválida",
        description: "Por favor, insira sua chave PIX",
        variant: "destructive",
      })
      return
    }

    // Validação básica de chave PIX
    if (pixKeyType === "cpf" && !/^\d{11}$/.test(pixKey.replace(/\D/g, ""))) {
      toast({
        title: "CPF inválido",
        description: "Por favor, insira um CPF válido (11 dígitos)",
        variant: "destructive",
      })
      return
    }

    if (pixKeyType === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pixKey)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido",
        variant: "destructive",
      })
      return
    }

    setIsWithdrawLoading(true)

    try {
      // Simular processamento
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const withdrawal = {
        id: Date.now().toString(),
        amount,
        status: "pending",
        timestamp: new Date().toISOString(),
        accountType: "real",
      }

      addWithdrawal(withdrawal)

      toast({
        title: "Saque solicitado",
        description: "Seu saque foi solicitado com sucesso e será processado em breve",
      })

      setWithdrawAmount("")
      setPixKey("")
    } catch (error) {
      toast({
        title: "Erro ao processar saque",
        description: "Ocorreu um erro ao processar seu saque. Tente novamente mais tarde",
        variant: "destructive",
      })
    } finally {
      setIsWithdrawLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="w-full">
        <CardHeader className="bg-muted/50">
          <CardTitle>Saque via PIX</CardTitle>
          <CardDescription>Solicite um saque para sua conta bancária via PIX</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="withdraw-amount">Valor do Saque</Label>
            <div className="flex items-center">
              <span className="bg-muted px-3 py-2 border border-r-0 rounded-l-md">R$</span>
              <Input
                id="withdraw-amount"
                type="text"
                value={withdrawAmount}
                onChange={(e) => handleWithdrawAmountChange(e.target.value)}
                className="rounded-l-none"
                placeholder="Digite o valor"
              />
            </div>
            <p className="text-xs text-muted-foreground">Valor mínimo: R$ 50,00</p>
          </div>

          <div className="space-y-2">
            <Label>Tipo de Chave PIX</Label>
            <RadioGroup value={pixKeyType} onValueChange={setPixKeyType} className="grid grid-cols-3 gap-2">
              <div>
                <RadioGroupItem value="cpf" id="pix-cpf" className="peer sr-only" />
                <Label
                  htmlFor="pix-cpf"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span className="text-sm font-semibold">CPF</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="email" id="pix-email" className="peer sr-only" />
                <Label
                  htmlFor="pix-email"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span className="text-sm font-semibold">Email</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="random" id="pix-random" className="peer sr-only" />
                <Label
                  htmlFor="pix-random"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span className="text-sm font-semibold">Aleatória</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pix-key">Chave PIX</Label>
            <Input
              id="pix-key"
              type={pixKeyType === "email" ? "email" : "text"}
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              placeholder={
                pixKeyType === "cpf"
                  ? "Digite seu CPF (apenas números)"
                  : pixKeyType === "email"
                    ? "Digite seu email"
                    : "Digite sua chave aleatória"
              }
            />
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <div className="flex justify-between">
              <span>Valor do saque</span>
              <span className="font-medium">{formatCurrency(Number(withdrawAmount) || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxa de saque</span>
              <span className="font-medium">R$ 0,00</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2 mt-2">
              <span>Valor líquido</span>
              <span>{formatCurrency(Number(withdrawAmount) || 0)}</span>
            </div>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• O saque será processado em até 24 horas úteis.</p>
            <p>• A chave PIX deve estar no mesmo CPF da sua conta.</p>
            <p>• Saldo disponível para saque: {formatCurrency(balance)}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full gap-2"
            onClick={handleWithdraw}
            disabled={
              isWithdrawLoading ||
              !withdrawAmount ||
              !pixKey ||
              Number(withdrawAmount) > balance ||
              Number(withdrawAmount) < 50
            }
          >
            {isWithdrawLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <ArrowUpFromLine className="h-4 w-4 mr-2" />
                Solicitar Saque
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
