import { useContext } from 'react'
import { PlatformContext } from './context'

export function usePlatform() {
  const ctx = useContext(PlatformContext)
  if (!ctx) throw new Error('usePlatform moet binnen PlatformProvider gebruikt worden')
  return ctx
}
