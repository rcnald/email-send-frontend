import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const NON_DIGIT_REGEX = /\D/g
const CNPJ_FIRST_DOT_REGEX = /(\d{2})(\d)/
const CNPJ_SECOND_DOT_REGEX = /(\d{3})(\d)/
const CNPJ_SLASH_REGEX = /(\d{3})(\d)/
const CNPJ_DASH_REGEX = /(\d{4})(\d)/
const CNPJ_TRAILING_DIGITS_REGEX = /(-\d{2})\d+?$/

export function maskCNPJ(value: string): string {
  const onlyDigits = value.replace(NON_DIGIT_REGEX, "").slice(0, 14)

  return onlyDigits
    .replace(CNPJ_FIRST_DOT_REGEX, "$1.$2")
    .replace(CNPJ_SECOND_DOT_REGEX, "$1.$2")
    .replace(CNPJ_SLASH_REGEX, "$1/$2")
    .replace(CNPJ_DASH_REGEX, "$1-$2")
    .replace(CNPJ_TRAILING_DIGITS_REGEX, "$1")
}
