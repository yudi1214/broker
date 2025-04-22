import { CheckCircle, Clock, AlertTriangle, HelpCircle } from "lucide-react"

interface KYCStatusProps {
  status: "not_submitted" | "pending" | "verified" | "rejected"
}

export function KYCStatus({ status }: KYCStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "not_submitted":
        return {
          icon: <HelpCircle className="h-5 w-5 text-muted-foreground" />,
          label: "Não enviado",
          description: "Você ainda não enviou seus documentos para verificação.",
          color: "text-muted-foreground",
          bgColor: "bg-muted/30",
        }
      case "pending":
        return {
          icon: <Clock className="h-5 w-5 text-amber-500" />,
          label: "Em análise",
          description: "Seus documentos estão sendo analisados pela nossa equipe.",
          color: "text-amber-500",
          bgColor: "bg-amber-50 dark:bg-amber-950/30",
        }
      case "verified":
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          label: "Verificado",
          description: "Sua identidade foi verificada com sucesso.",
          color: "text-green-500",
          bgColor: "bg-green-50 dark:bg-green-950/30",
        }
      case "rejected":
        return {
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
          label: "Rejeitado",
          description: "Sua verificação foi rejeitada. Por favor, envie novos documentos.",
          color: "text-red-500",
          bgColor: "bg-red-50 dark:bg-red-950/30",
        }
      default:
        return {
          icon: <HelpCircle className="h-5 w-5 text-muted-foreground" />,
          label: "Não enviado",
          description: "Você ainda não enviou seus documentos para verificação.",
          color: "text-muted-foreground",
          bgColor: "bg-muted/30",
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className={`p-4 rounded-lg ${config.bgColor}`}>
      <div className="flex items-center gap-3">
        {config.icon}
        <div>
          <h3 className={`font-medium ${config.color}`}>{config.label}</h3>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>
      </div>
    </div>
  )
}
