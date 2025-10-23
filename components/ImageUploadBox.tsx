"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, X } from "lucide-react"

interface ImageUploadBoxProps {
  onNext?: (imageUrl: string) => void
}

export function ImageUploadBox({ onNext }: ImageUploadBoxProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    setFileName("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleBoxClick = () => {
    fileInputRef.current?.click()
  }

  const handleNext = () => {
    if (preview && onNext) {
      onNext(preview)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <Card className="p-6">
        {!preview ? (
          <div
            onClick={handleBoxClick}
            className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors"
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">クリックして画像を選択</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, GIF形式に対応</p>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-auto rounded-lg" />
              <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={handleRemove}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground truncate">{fileName}</p>
          </div>
        )}
      </Card>

      {preview && (
        <Button onClick={handleNext} className="w-full" size="lg">
          次へ
        </Button>
      )}
    </div>
  )
}
