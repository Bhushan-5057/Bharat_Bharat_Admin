
'use client'

import { toast } from 'sonner'
import { CheckCircle, XCircle, Info } from 'lucide-react'
import { ReactNode } from 'react'

type ToastMessage = string

interface CustomToastOptions {
  duration?: number
  id?: string | number
  description?: ReactNode
  icon?: ReactNode
  action?: {
    label: string
    onClick: () => void
  }
 
  [key: string]: unknown
}

export const showSuccess = (msg: ToastMessage, options?: CustomToastOptions) => {
  toast.success(msg, {
    icon: <CheckCircle className="text-green-500 w-5 h-5" />,
    ...options,
  })
}

export const showError = (msg: ToastMessage, options?: CustomToastOptions) => {
  toast.error(msg, {
    icon: <XCircle className="text-red-500 w-5 h-5" />,
    ...options,
  })
}

export const showInfo = (msg: ToastMessage, options?: CustomToastOptions) => {
  toast(msg, {
    icon: <Info className="text-blue-500 w-5 h-5" />,
    ...options,
  })
}
