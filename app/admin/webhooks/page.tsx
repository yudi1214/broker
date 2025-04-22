"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Trash, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function WebhooksPage() {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [webhooks, setWebhooks] = useState([
    {
      id: 1,
      name: "Sistema de Contabilidade",
      url: "https://accounting.example.com/webhook",
      events: ["deposit.completed", "withdrawal.completed"],
      status: "active",
      lastTriggered: "2023-05-15 14:32:45",
    },
    {
      id: 2,
      name: "CRM",
      url: "https://crm.example.com/webhook",
      events: ["user.created", "user.updated"],
      status: "active",
      lastTriggered: "2023-05-14 09:15:22",
    },
    {
      id: 3,
      name: "Sistema de Notificações",
      url: "https://notifications.example.com/webhook",
      events: ["trade.completed"],
      status: "inactive",
      lastTriggered: "2023-05-10 18:45:10",
    },
  ])

  const [newWebhook, setNewWebhook] = useState({
    name: "",
    url: "",
    events: [] as string[],
  })

  const availableEvents = [
    { value: "user.created", label: "Usuário Criado" },
    { value: "user.updated", label: "Usuário Atualizado" },
    { value: "deposit.created", label: "Depósito Criado" },
    { value: "deposit.completed", label: "Depósito Concluído" },
    { value: "withdrawal.created", label: "Saque Criado" },
    { value: "withdrawal.completed", label: "Saque Concluído" },
    { value: "trade.created", label: "Aposta Criada" },
    { value: "trade.completed", label: "Aposta Concluída" },
  ]

  const handleAddWebhook = () => {
    if (!newWebhook.name || !newWebhook.url || newWebhook.events.length === 0) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    const webhook = {
      id: webhooks.length + 1,
      name: newWebhook.name,
      url: newWebhook.url,
      events: newWebhook.events,
      status: "active",
      lastTriggered: "Nunca",
    }

    setWebhooks([...webhooks, webhook])
    setNewWebhook({ name: "", url: "", events: [] })
    setIsDialogOpen(false)

    toast({
      title: "Webhook adicionado",
      description: "O webhook foi adicionado com sucesso.",
    })
  }

  const handleDeleteWebhook = (id: number) => {
    setWebhooks(webhooks.filter((webhook) => webhook.id !== id))
    toast({
      title: "Webhook removido",
      description: "O webhook foi removido com sucesso.",
    })
  }

  const handleToggleWebhookStatus = (id: number) => {
    setWebhooks(
      webhooks.map((webhook) =>
        webhook.id === id ? { ...webhook, status: webhook.status === "active" ? "inactive" : "active" } : webhook,
      ),
    )

    const webhook = webhooks.find((w) => w.id === id)
    toast({
      title: `Webhook ${webhook?.status === "active" ? "desativado" : "ativado"}`,
      description: `O webhook "${webhook?.name}" foi ${
        webhook?.status === "active" ? "desativado" : "ativado"
      } com sucesso.`,
    })
  }

  const handleEventChange = (event: string) => {
    if (newWebhook.events.includes(event)) {
      setNewWebhook({
        ...newWebhook,
        events: newWebhook.events.filter((e) => e !== event),
      })
    } else {
      setNewWebhook({
        ...newWebhook,
        events: [...newWebhook.events, event],
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Webhooks</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Webhook
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Webhooks Configurados</CardTitle>
          <CardDescription>
            Webhooks permitem que sistemas externos recebam notificações em tempo real sobre eventos na plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Eventos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Execução</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.map((webhook) => (
                <TableRow key={webhook.id}>
                  <TableCell className="font-medium">{webhook.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="truncate max-w-[200px]">{webhook.url}</span>
                      <a href={webhook.url} target="_blank" rel="noopener noreferrer" className="ml-2">
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={webhook.status === "active" ? "default" : "secondary"}>
                      {webhook.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>{webhook.lastTriggered}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Switch
                        checked={webhook.status === "active"}
                        onCheckedChange={() => handleToggleWebhookStatus(webhook.id)}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteWebhook(webhook.id)}
                        className="h-8 w-8"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {webhooks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    Nenhum webhook configurado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Webhook</DialogTitle>
            <DialogDescription>
              Configure um novo webhook para receber notificações de eventos em tempo real.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={newWebhook.name}
                onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                placeholder="Nome do sistema externo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL do Webhook</Label>
              <Input
                id="url"
                value={newWebhook.url}
                onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                placeholder="https://seu-sistema.com/webhook"
              />
            </div>
            <div className="space-y-2">
              <Label>Eventos</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableEvents.map((event) => (
                  <div key={event.value} className="flex items-center space-x-2">
                    <Switch
                      id={`event-${event.value}`}
                      checked={newWebhook.events.includes(event.value)}
                      onCheckedChange={() => handleEventChange(event.value)}
                    />
                    <Label htmlFor={`event-${event.value}`}>{event.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddWebhook}>Adicionar Webhook</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
