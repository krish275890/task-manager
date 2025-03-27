"use client"

import { useState } from "react"
import { useTasks, type Task, type Priority } from "./task-context"
import TaskList from "./task-list"
import TaskForm from "./task-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import TaskFilters from "./task-filters"
import { ModeToggle } from "./mode-toggle"

type SortOption = "createdAt" | "priority"
type FilterOption = "all" | "active" | "completed"

export default function TaskDashboard() {
  const { tasks } = useTasks()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>("createdAt")
  const [filterBy, setFilterBy] = useState<FilterOption>("all")

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingTask(null)
  }

  const filteredTasks = tasks.filter((task) => {
    if (filterBy === "all") return true
    if (filterBy === "active") return !task.completed
    if (filterBy === "completed") return task.completed
    return true
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "createdAt") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else if (sortBy === "priority") {
      const priorityValues = { high: 3, medium: 2, low: 1 }
      return priorityValues[b.priority as Priority] - priorityValues[a.priority as Priority]
    }
    return 0
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Task Manager</h1>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
      </div>

      <TaskFilters sortBy={sortBy} filterBy={filterBy} onSortChange={setSortBy} onFilterChange={setFilterBy} />

      <TaskList tasks={sortedTasks} onEditTask={handleEditTask} />

      {isFormOpen && <TaskForm task={editingTask} isOpen={isFormOpen} onClose={handleCloseForm} />}
    </div>
  )
}

