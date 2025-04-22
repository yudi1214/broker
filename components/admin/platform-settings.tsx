"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function PlatformSettings() {
  return (
    <Tabs defaultValue="general">
      <TabsList className="mb-4">
        <TabsTrigger value="general">Geral</TabsTrigger>
        <TabsTrigger value="trading">Trading</TabsTrigger>
        <TabsTrigger value="finance">Financeiro</TabsTrigger>
        <TabsTrigger value="security">Segurança</TabsTrigger>
        <TabsTrigger value="notifications">Notificações</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>Configurações Gerais</CardTitle>
            <CardDescription>Configure as opções gerais da plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform-name">Nome da Plataforma</Label>
                <Input id="platform-name" defaultValue="Binary Options Platform" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform-description">Descrição da Plataforma</Label>
                <Textarea
                  id="platform-description"
                  defaultValue="Plataforma de opções binárias com múltiplos ativos e alta rentabilidade."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="support-email">Email de Suporte</Label>
                <Input id="support-email" type="email" defaultValue="support@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Fuso Horário</Label>
                <Select defaultValue="UTC-3">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Selecione um fuso horário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC-5">UTC-5 (EST)</SelectItem>
                    <SelectItem value="UTC-4">UTC-4 (EDT)</SelectItem>
                    <SelectItem value="UTC-3">UTC-3 (Brasília)</SelectItem>
                    <SelectItem value="UTC">UTC (GMT)</SelectItem>
                    <SelectItem value="UTC+1">UTC+1 (CET)</SelectItem>
                    <SelectItem value="UTC+2">UTC+2 (EET)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance-mode">Modo de Manutenção</Label>
                  <p className="text-sm text-muted-foreground">Ativa o modo de manutenção para todos os usuários.</p>
                </div>
                <Switch id="maintenance-mode" />
              </div>
            </div>

            <Button>Salvar Configurações</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="trading">
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Trading</CardTitle>
            <CardDescription>Configure as opções de trading da plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-payout">Payout Padrão (%)</Label>
                <Input id="default-payout" type="number" defaultValue="85" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="min-trade-amount">Valor Mínimo de Aposta</Label>
                <Input id="min-trade-amount" type="number" defaultValue="10" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-trade-amount">Valor Máximo de Aposta</Label>
                <Input id="max-trade-amount" type="number" defaultValue="10000" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-expiry">Tempo de Expiração Padrão (segundos)</Label>
                <Input id="default-expiry" type="number" defaultValue="60" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="demo-account">Contas Demo</Label>
                  <p className="text-sm text-muted-foreground">Permite que usuários criem contas de demonstração.</p>
                </div>
                <Switch id="demo-account" defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="demo-balance">Saldo Inicial da Conta Demo</Label>
                <Input id="demo-balance" type="number" defaultValue="10000" />
              </div>
            </div>

            <Button>Salvar Configurações</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="finance">
        <Card>
          <CardHeader>
            <CardTitle>Configurações Financeiras</CardTitle>
            <CardDescription>Configure as opções financeiras da plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-currency">Moeda Padrão</Label>
                <Select defaultValue="BRL">
                  <SelectTrigger id="default-currency">
                    <SelectValue placeholder="Selecione uma moeda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">Real (BRL)</SelectItem>
                    <SelectItem value="USD">Dólar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="min-deposit">Depósito Mínimo</Label>
                <Input id="min-deposit" type="number" defaultValue="50" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="min-withdrawal">Saque Mínimo</Label>
                <Input id="min-withdrawal" type="number" defaultValue="100" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="withdrawal-fee">Taxa de Saque (%)</Label>
                <Input id="withdrawal-fee" type="number" defaultValue="2.5" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-withdrawal">Saques Automáticos</Label>
                  <p className="text-sm text-muted-foreground">Processa saques automaticamente sem aprovação manual.</p>
                </div>
                <Switch id="auto-withdrawal" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="auto-withdrawal-limit">Limite para Saque Automático</Label>
                <Input id="auto-withdrawal-limit" type="number" defaultValue="1000" />
              </div>
            </div>

            <Button>Salvar Configurações</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Segurança</CardTitle>
            <CardDescription>Configure as opções de segurança da plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="force-2fa">Forçar 2FA</Label>
                  <p className="text-sm text-muted-foreground">
                    Exige que todos os usuários ativem a autenticação de dois fatores.
                  </p>
                </div>
                <Switch id="force-2fa" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="force-kyc">Forçar KYC</Label>
                  <p className="text-sm text-muted-foreground">
                    Exige que todos os usuários completem a verificação KYC antes de operar.
                  </p>
                </div>
                <Switch id="force-kyc" defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="session-timeout">Tempo Limite da Sessão (minutos)</Label>
                <Input id="session-timeout" type="number" defaultValue="30" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-login-attempts">Máximo de Tentativas de Login</Label>
                <Input id="max-login-attempts" type="number" defaultValue="5" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-policy">Política de Senha</Label>
                <Select defaultValue="strong">
                  <SelectTrigger id="password-policy">
                    <SelectValue placeholder="Selecione uma política" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Básica (mínimo 8 caracteres)</SelectItem>
                    <SelectItem value="medium">Média (letras e números, mínimo 8 caracteres)</SelectItem>
                    <SelectItem value="strong">Forte (letras, números e símbolos, mínimo 10 caracteres)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button>Salvar Configurações</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Notificações</CardTitle>
            <CardDescription>Configure as opções de notificações da plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Envia notificações por email para eventos importantes.
                  </p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="trade-notifications">Notificações de Apostas</Label>
                  <p className="text-sm text-muted-foreground">Notifica usuários sobre resultados de apostas.</p>
                </div>
                <Switch id="trade-notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="deposit-notifications">Notificações de Depósito</Label>
                  <p className="text-sm text-muted-foreground">Notifica usuários sobre depósitos processados.</p>
                </div>
                <Switch id="deposit-notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="withdrawal-notifications">Notificações de Saque</Label>
                  <p className="text-sm text-muted-foreground">Notifica usuários sobre saques processados.</p>
                </div>
                <Switch id="withdrawal-notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing-notifications">Notificações de Marketing</Label>
                  <p className="text-sm text-muted-foreground">Envia notificações de marketing e promoções.</p>
                </div>
                <Switch id="marketing-notifications" />
              </div>
            </div>

            <Button>Salvar Configurações</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
