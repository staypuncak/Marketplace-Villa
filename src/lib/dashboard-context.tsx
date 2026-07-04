'use client'

import { createContext, useContext } from 'react'

type DashboardContextType = {
  adminName: string
}

const DashboardContext = createContext<DashboardContextType>({ adminName: '' })

export function useDashboard() {
  return useContext(DashboardContext)
}

export function DashboardProvider({
  children,
  adminName,
}: {
  children: React.ReactNode
  adminName: string
}) {
  return (
    <DashboardContext.Provider value={{ adminName }}>
      {children}
    </DashboardContext.Provider>
  )
}
