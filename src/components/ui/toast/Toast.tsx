import React from 'react';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

const toastStyles = {
  success: 'bg-green-100 text-green-800 border-green-300',
  error: 'bg-red-100 text-red-800 border-red-300',
  info: 'bg-blue-100 text-blue-800 border-blue-300',
};

const icons = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <AlertTriangle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
};

interface Props {
  message: string;
  type?: 'success' | 'error' | 'info';
}

export default function Toast({ message, type = 'info' }: Props) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-sm transition-all duration-300 ${toastStyles[type]}`}
    >
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
