"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string>("An authentication error occurred")

  useEffect(() => {
    const error = searchParams.get("error")

    if (error) {
      switch (error) {
        case "CredentialsSignin":
          setErrorMessage("Invalid email or password. Please try again.")
          break
        case "SessionRequired":
          setErrorMessage("You need to be signed in to access this page.")
          break
        case "AccessDenied":
          setErrorMessage("You don't have permission to access this resource.")
          break
        default:
          setErrorMessage(`Authentication error: ${error}`)
      }
    }
  }, [searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4 text-destructive">
            <AlertCircle className="h-10 w-10" />
          </div>
          <CardTitle className="text-2xl text-center">Authentication Error</CardTitle>
          <CardDescription className="text-center">{errorMessage}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/login">Back to Login</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Go to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
