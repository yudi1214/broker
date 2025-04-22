"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useUserStore } from "@/lib/stores/user-store"
import { useAccountStore } from "@/lib/stores/account-store"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatCurrency } from "@/lib/utils"
import {
  Camera,
  Key,
  Languages,
  LogOut,
  Shield,
  Upload,
  UserIcon,
  ArrowDownToLine,
  ArrowUpFromLine,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { DepositForm } from "@/components/finance/deposit-form"
import { WithdrawForm } from "@/components/finance/withdraw-form"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface UserData {
  id: string
  name: string
  email: string
  role: string
  image?: string
  demoBalance?: number
  realBalance?: number
}

export function UserProfile() {
  const { user: storeUser, updateUser } = useUserStore()
  const { accountType, toggleAccountType } = useAccountStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const section = searchParams.get("section")
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("info")
  const [localUser, setLocalUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    if (section) {
      if (section === "deposit" || section === "withdraw") {
        setActiveTab(section)
      }
    }
  }, [section])

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch("/api/user")
        const data = await response.json()

        if (data.success && data.user) {
          setLocalUser(data.user)
          // Atualizar também o store para manter consistência
          updateUser({
            ...data.user,
            demoBalance: data.user.demoBalance || 0,
            realBalance: data.user.realBalance || 0,
          })
        } else {
          toast({
            title: "Erro",
            description: data.message || "Falha ao carregar dados do usuário",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error)
        toast({
          title: "Erro",
          description: "Falha ao carregar dados do usuário",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [toast, updateUser])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (response.ok) {
        // Limpar dados do usuário no store
        updateUser(null)
        router.push("/login")
      } else {
        toast({
          title: "Erro",
          description: "Falha ao fazer logout",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      toast({
        title: "Erro",
        description: "Falha ao fazer logout",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Usar dados do localUser (da API) ou fallback para o store
  const userData = localUser || storeUser

  if (!userData) {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Sessão expirada</h2>
        <p className="mb-4">Sua sessão expirou ou você não está logado.</p>
        <Button onClick={() => router.push("/login")}>Ir para Login</Button>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Informações da Conta */}
      <Card className="md:col-span-1 bg-card/50">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={userData?.image || ""} alt={userData?.name || ""} />
                <AvatarFallback className="text-4xl">{(userData?.name || "U").charAt(0)}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            <h2 className="text-xl font-bold">{userData?.name}</h2>

            <div className="w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Tipo de Conta</span>
                <span
                  className={cn(
                    "px-2 py-1 rounded-sm text-xs font-medium",
                    accountType === "demo" ? "bg-warning/20 text-warning" : "bg-success/20 text-success",
                  )}
                >
                  {accountType === "demo" ? "DEMO" : "REAL"}
                </span>
              </div>

              <div className="space-y-4 mt-6">
                <div>
                  <span className="text-sm text-muted-foreground">Saldo Demo</span>
                  <p className="text-xl font-bold">{formatCurrency(userData?.demoBalance || 0)}</p>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground">Saldo Real</span>
                  <p className="text-xl font-bold">{formatCurrency(userData?.realBalance || 0)}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  onClick={() => setActiveTab("deposit")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  size="lg"
                >
                  <ArrowDownToLine className="h-5 w-5" />
                  Depositar
                </Button>
                <Button
                  onClick={() => setActiveTab("withdraw")}
                  variant="outline"
                  className="w-full flex items-center gap-2"
                  size="lg"
                >
                  <ArrowUpFromLine className="h-5 w-5" />
                  Sacar
                </Button>
              </div>

              <Button
                variant="destructive"
                className="w-full mt-4 bg-red-600 hover:bg-red-700"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saindo...
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair da Conta
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo Principal */}
      <div className="md:col-span-3">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 mb-6">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Informações</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Segurança</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <span className="hidden sm:inline">Preferências</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Documentos</span>
            </TabsTrigger>
            <TabsTrigger
              value="deposit"
              className="flex items-center gap-2 bg-green-600/10 text-green-600 data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <ArrowDownToLine className="h-4 w-4" />
              <span className="hidden sm:inline">Depositar</span>
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="flex items-center gap-2">
              <ArrowUpFromLine className="h-4 w-4" />
              <span className="hidden sm:inline">Sacar</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold mb-4">Informações Pessoais</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" defaultValue={userData?.name || ""} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={userData?.email || ""} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" type="tel" placeholder="(00) 00000-0000" />
                  </div>

                  <Button className="mt-4 bg-primary">Salvar Alterações</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold mb-4">Alterar Senha</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Senha Atual</Label>
                    <Input id="current-password" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input id="new-password" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                    <Input id="confirm-password" type="password" />
                  </div>

                  <Button className="mt-4 bg-primary">Alterar Senha</Button>
                </div>

                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">Autenticação de Dois Fatores</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Ativar 2FA</p>
                      <p className="text-sm text-muted-foreground">
                        Proteja sua conta com autenticação de dois fatores
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold mb-4">Preferências</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Select defaultValue="pt-BR">
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Selecione o idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuso Horário</Label>
                    <Select defaultValue="America/Sao_Paulo">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Selecione o fuso horário" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                        <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Notificações</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-notifications" className="cursor-pointer">
                          Notificações por email
                        </Label>
                        <Switch id="email-notifications" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="trade-notifications" className="cursor-pointer">
                          Alertas de operações
                        </Label>
                        <Switch id="trade-notifications" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="deposit-notifications" className="cursor-pointer">
                          Alertas de depósitos e saques
                        </Label>
                        <Switch id="deposit-notifications" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Button className="mt-4 bg-primary">Salvar Preferências</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold mb-4">Verificação de Identidade</h3>
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                    <div className="mb-4 rounded-full bg-muted p-3">
                      <Camera className="h-6 w-6" />
                    </div>
                    <h3 className="mb-1 text-lg font-semibold">Envie seus documentos</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Envie uma foto do seu documento de identidade para verificar sua conta
                    </p>
                    <Button>Selecionar Arquivo</Button>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-2">Documentos Necessários</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <Key className="h-4 w-4 mr-2" />
                      RG ou CNH (frente e verso)
                    </li>
                    <li className="flex items-center">
                      <Key className="h-4 w-4 mr-2" />
                      Comprovante de residência (últimos 3 meses)
                    </li>
                    <li className="flex items-center">
                      <Key className="h-4 w-4 mr-2" />
                      Selfie segurando o documento
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deposit">
            <DepositForm />
          </TabsContent>

          <TabsContent value="withdraw">
            <WithdrawForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
