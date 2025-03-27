"use client"
import { TaskProvider } from "@/components/task-context"
import TaskDashboard from "@/components/task-dashboard"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="task-manager-theme">
      <TaskProvider>
        <main className="min-h-screen bg-background">
          <TaskDashboard />
        </main>
      </TaskProvider>
    </ThemeProvider>
  )
}

