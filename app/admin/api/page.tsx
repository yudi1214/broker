"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Key, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ApiPage() {
  const { toast } = useToast()
  const [apiKey, setApiKey] = useState("sk_live_51KjH7gJhV5RnB9X2ZpL8VdY6TmW3cK")
  const [webhookUrl, setWebhookUrl] = useState("https://example.com/webhook")
  const [webhookSecret, setWebhookSecret] = useState("whsec_8FtH7gJhV5RnB9X2ZpL8VdY6TmW3cK")

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey)
    toast({
      title: "Chave API copiada",
      description: "A chave API foi copiada para a área de transferência.",
    })
  }

  const handleCopyWebhookSecret = () => {
    navigator.clipboard.writeText(webhookSecret)
    toast({
      title: "Segredo do Webhook copiado",
      description: "O segredo do Webhook foi copiado para a área de transferência.",
    })
  }

  const handleRegenerateApiKey = () => {
    // Simulação de geração de nova chave API
    setApiKey(`sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`)
    toast({
      title: "Chave API regenerada",
      description: "Uma nova chave API foi gerada com sucesso.",
    })
  }

  const handleRegenerateWebhookSecret = () => {
    // Simulação de geração de novo segredo de webhook
    setWebhookSecret(
      `whsec_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
    )
    toast({
      title: "Segredo do Webhook regenerado",
      description: "Um novo segredo do Webhook foi gerado com sucesso.",
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Acesso à API</h2>

      <Tabs defaultValue="keys" className="w-full">
        <TabsList>
          <TabsTrigger value="keys">Chaves API</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="docs">Documentação</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chaves API</CardTitle>
              <CardDescription>Gerencie suas chaves de API para integração com a plataforma.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Chave API</Label>
                <div className="flex">
                  <Input id="api-key" value={apiKey} readOnly className="flex-1" />
                  <Button variant="outline" size="icon" onClick={handleCopyApiKey} className="ml-2">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Esta chave é usada para autenticar suas solicitações à API. Mantenha-a segura e não compartilhe com
                  ninguém.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="api-enabled" defaultChecked />
                <Label htmlFor="api-enabled">API Habilitada</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ip-whitelist">Lista de IPs permitidos (um por linha)</Label>
                <Textarea id="ip-whitelist" placeholder="192.168.1.1" />
                <p className="text-sm text-muted-foreground">
                  Deixe em branco para permitir solicitações de qualquer IP.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="gap-2" onClick={handleRegenerateApiKey}>
                <RefreshCw className="h-4 w-4" />
                Regenerar Chave API
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Permissões da API</CardTitle>
              <CardDescription>Configure quais operações sua chave API pode realizar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="read-users">Leitura de Usuários</Label>
                  <p className="text-sm text-muted-foreground">Permite ler informações de usuários.</p>
                </div>
                <Switch id="read-users" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="write-users">Escrita de Usuários</Label>
                  <p className="text-sm text-muted-foreground">Permite criar e atualizar usuários.</p>
                </div>
                <Switch id="write-users" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="read-trades">Leitura de Apostas</Label>
                  <p className="text-sm text-muted-foreground">Permite ler informações de apostas.</p>
                </div>
                <Switch id="read-trades" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="write-trades">Escrita de Apostas</Label>
                  <p className="text-sm text-muted-foreground">Permite criar e atualizar apostas.</p>
                </div>
                <Switch id="write-trades" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="read-finance">Leitura Financeira</Label>
                  <p className="text-sm text-muted-foreground">Permite ler informações financeiras.</p>
                </div>
                <Switch id="read-finance" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="write-finance">Escrita Financeira</Label>
                  <p className="text-sm text-muted-foreground">Permite criar e atualizar transações financeiras.</p>
                </div>
                <Switch id="write-finance" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvar Permissões</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Webhooks</CardTitle>
              <CardDescription>Configure webhooks para receber notificações de eventos em tempo real.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">URL do Webhook</Label>
                <Input
                  id="webhook-url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://seu-site.com/webhook"
                />
                <p className="text-sm text-muted-foreground">URL para onde enviaremos notificações de eventos.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-secret">Segredo do Webhook</Label>
                <div className="flex">
                  <Input id="webhook-secret" value={webhookSecret} readOnly className="flex-1" />
                  <Button variant="outline" size="icon" onClick={handleCopyWebhookSecret} className="ml-2">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Use este segredo para verificar a autenticidade das notificações.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="webhook-enabled" defaultChecked />
                <Label htmlFor="webhook-enabled">Webhooks Habilitados</Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="gap-2" onClick={handleRegenerateWebhookSecret}>
                <Key className="h-4 w-4" />
                Regenerar Segredo
              </Button>
              <Button>Salvar Configurações</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Eventos do Webhook</CardTitle>
              <CardDescription>Selecione quais eventos você deseja receber via webhook.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="event-user-created">Usuário Criado</Label>
                  <p className="text-sm text-muted-foreground">Quando um novo usuário é registrado.</p>
                </div>
                <Switch id="event-user-created" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="event-user-updated">Usuário Atualizado</Label>
                  <p className="text-sm text-muted-foreground">Quando um usuário é atualizado.</p>
                </div>
                <Switch id="event-user-updated" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="event-deposit-created">Depósito Criado</Label>
                  <p className="text-sm text-muted-foreground">Quando um novo depósito é iniciado.</p>
                </div>
                <Switch id="event-deposit-created" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="event-deposit-completed">Depósito Concluído</Label>
                  <p className="text-sm text-muted-foreground">Quando um depósito é aprovado.</p>
                </div>
                <Switch id="event-deposit-completed" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="event-withdrawal-created">Saque Criado</Label>
                  <p className="text-sm text-muted-foreground">Quando um novo saque é solicitado.</p>
                </div>
                <Switch id="event-withdrawal-created" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="event-withdrawal-completed">Saque Concluído</Label>
                  <p className="text-sm text-muted-foregroun">Quando um saque é aprovado.</p>
                </div>
                <Switch id="event-withdrawal-completed" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="event-trade-created">Aposta Criada</Label>
                  <p className="text-sm text-muted-foreground">Quando uma nova aposta é feita.</p>
                </div>
                <Switch id="event-trade-created" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="event-trade-completed">Aposta Concluída</Label>
                  <p className="text-sm text-muted-foreground">Quando uma aposta é finalizada.</p>
                </div>
                <Switch id="event-trade-completed" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvar Eventos</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentação da API</CardTitle>
              <CardDescription>Guia de referência para usar a API da plataforma.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Autenticação</h3>
                <p>
                  Todas as solicitações à API devem incluir sua chave API no cabeçalho <code>Authorization</code>:
                </p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>Authorization: Bearer {apiKey}</code>
                </pre>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Endpoints Disponíveis</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-md font-semibold">Usuários</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        <code>GET /api/users</code> - Listar todos os usuários
                      </li>
                      <li>
                        <code>GET /api/users/:id</code> - Obter um usuário específico
                      </li>
                      <li>
                        <code>POST /api/users</code> - Criar um novo usuário
                      </li>
                      <li>
                        <code>PUT /api/users/:id</code> - Atualizar um usuário
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-md font-semibold">Apostas</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        <code>GET /api/trades</code> - Listar todas as apostas
                      </li>
                      <li>
                        <code>GET /api/trades/:id</code> - Obter uma aposta específica
                      </li>
                      <li>
                        <code>POST /api/trades</code> - Criar uma nova aposta
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-md font-semibold">Finanças</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        <code>GET /api/deposits</code> - Listar todos os depósitos
                      </li>
                      <li>
                        <code>GET /api/withdrawals</code> - Listar todos os saques
                      </li>
                      <li>
                        <code>POST /api/deposits</code> - Criar um novo depósito
                      </li>
                      <li>
                        <code>POST /api/withdrawals</code> - Solicitar um novo saque
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Webhooks</h3>
                <p>
                  Para verificar a autenticidade dos webhooks, compare a assinatura no cabeçalho{" "}
                  <code>X-Webhook-Signature</code> com o HMAC SHA-256 do corpo da solicitação usando seu segredo de
                  webhook.
                </p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>
                    {`const crypto = require('crypto');

const signature = req.headers['x-webhook-signature'];
const payload = JSON.stringify(req.body);
const expectedSignature = crypto
  .createHmac('sha256', '${webhookSecret}')
  .update(payload)
  .digest('hex');

if (signature === expectedSignature) {
  // Webhook é autêntico
}`}
                  </code>
                </pre>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Baixar Documentação Completa</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
