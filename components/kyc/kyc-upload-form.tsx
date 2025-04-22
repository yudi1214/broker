"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon, Upload, FileText, Camera, Home, CheckCircle, X } from "lucide-react"
import { Card } from "@/components/ui/card"

interface KYCUploadFormProps {
  onSubmit: (formData: FormData) => Promise<void>
  isSubmitting: boolean
}

export function KYCUploadForm({ onSubmit, isSubmitting }: KYCUploadFormProps) {
  // Referências para os inputs de arquivo
  const identityInputRef = useRef<HTMLInputElement>(null)
  const selfieInputRef = useRef<HTMLInputElement>(null)
  const addressInputRef = useRef<HTMLInputElement>(null)

  // Estado para armazenar os arquivos
  const [files, setFiles] = useState<{
    identity: File | null
    selfie: File | null
    address: File | null
  }>({
    identity: null,
    selfie: null,
    address: null,
  })

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!files.identity || !files.selfie || !files.address) {
      return
    }

    const formData = new FormData()
    formData.append("identity", files.identity)
    formData.append("selfie", files.selfie)
    formData.append("address", files.address)

    await onSubmit(formData)
  }

  // Função para lidar com a seleção de arquivos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "identity" | "selfie" | "address") => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({
        ...prev,
        [type]: e.target.files?.[0] || null,
      }))
    }
  }

  // Função para remover um arquivo
  const removeFile = (type: "identity" | "selfie" | "address") => {
    setFiles((prev) => ({
      ...prev,
      [type]: null,
    }))
  }

  // Funções para abrir o seletor de arquivos
  const openFilePicker = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current) {
      ref.current.click()
    }
  }

  return (
    <div>
      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          Para verificar sua identidade, precisamos que você envie os seguintes documentos:
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Inputs de arquivo escondidos */}
        <input
          ref={identityInputRef}
          type="file"
          className="hidden"
          accept="image/*,.pdf"
          onChange={(e) => handleFileChange(e, "identity")}
        />
        <input
          ref={selfieInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "selfie")}
        />
        <input
          ref={addressInputRef}
          type="file"
          className="hidden"
          accept="image/*,.pdf"
          onChange={(e) => handleFileChange(e, "address")}
        />

        <div className="space-y-4">
          {/* Documento de identidade */}
          <Card className="border rounded-lg p-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Documento de identidade</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  RG, CNH ou Passaporte (frente e verso em um único arquivo)
                </p>

                {!files.identity ? (
                  <div className="mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-32 border-2 border-dashed"
                      onClick={() => openFilePicker(identityInputRef)}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Clique para fazer upload</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG ou PDF</p>
                      </div>
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2 mt-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm truncate max-w-[200px]">{files.identity.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile("identity")}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remover arquivo</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Selfie com documento */}
          <Card className="border rounded-lg p-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Camera className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Selfie com documento</h3>
                <p className="text-sm text-muted-foreground mb-3">Uma foto sua segurando o documento de identidade</p>

                {!files.selfie ? (
                  <div className="mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-32 border-2 border-dashed"
                      onClick={() => openFilePicker(selfieInputRef)}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Clique para fazer upload</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG ou JPG</p>
                      </div>
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2 mt-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm truncate max-w-[200px]">{files.selfie.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile("selfie")}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remover arquivo</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Comprovante de endereço */}
          <Card className="border rounded-lg p-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Comprovante de endereço</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Conta de luz, água ou telefone (emitido nos últimos 3 meses)
                </p>

                {!files.address ? (
                  <div className="mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-32 border-2 border-dashed"
                      onClick={() => openFilePicker(addressInputRef)}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Clique para fazer upload</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG ou PDF</p>
                      </div>
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2 mt-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm truncate max-w-[200px]">{files.address.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile("address")}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remover arquivo</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!files.identity || !files.selfie || !files.address || isSubmitting}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? "Enviando..." : "Enviar documentos"}
          </Button>
        </div>
      </form>
    </div>
  )
}
