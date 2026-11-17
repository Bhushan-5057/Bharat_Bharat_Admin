
'use client'

import { toast } from 'sonner'
import { CheckCircle, XCircle, Info } from 'lucide-react'
import { ReactNode } from 'react'
import { getApiErrorMessage } from '@/lib/utils/apiError'

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

import { getApiSuccessMessage } from "@/lib/utils/apiError";

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

export const showApiError = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
  options?: CustomToastOptions
) => {
  showError(getApiErrorMessage(error, fallback), options)
}

export const showApiSuccess = (
  data: unknown,
  fallback: ToastMessage,
  options?: CustomToastOptions
) => {
  showSuccess(getApiSuccessMessage(data, fallback), options)
}

export const showInfo = (msg: ToastMessage, options?: CustomToastOptions) => {
  toast(msg, {
    icon: <Info className="text-blue-500 w-5 h-5" />,
    ...options,
  })
}
