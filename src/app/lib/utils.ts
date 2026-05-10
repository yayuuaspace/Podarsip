import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const UNIT_KERJA_OPTIONS = [
  'Kepala Desa',
  'Sekretaris Desa',
  'Kasi Pemerintahan',
  'Kasi Kesejahteraan',
  'Kasi Pelayanan',
  'Kaur Keuangan',
  'Kaur Umum dan Perencanaan',
]

export const CATEGORY_OPTIONS = [
  'kontrak',
  'laporan',
  'undangan',
  'peraturan',
  'surat keluar',
  'surat masuk',
] as const

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
