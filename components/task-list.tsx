"use client"

import type React from "react"

import { useState } from "react"
import { useTaskDispatch, type Task } from "./task-context"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface TaskListProps {
  tasks: Task[]
  onEditTask: (task: Task) => void
}

export default function TaskList({ tasks, onEditTask }: TaskListProps) {
  const dispatch = useTaskDispatch()
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null)

  const handleToggleComplete = (id: string) => {
    dispatch({ type: "TOGGLE_COMPLETE", payload: id })
  }

  const handleDeleteTask = (id: string) => {
    setDeleteTaskId(id)
  }

  const confirmDeleteTask = () => {
    if (deleteTaskId) {
      dispatch({ type: "DELETE_TASK", payload: deleteTaskId })
      setDeleteTaskId(null)
    }
  }

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetTask: Task) => {
    e.preventDefault()
    if (!draggedTask || draggedTask.id === targetTask.id) return

    const tasksCopy = [...tasks]
    const draggedIndex = tasksCopy.findIndex((t) => t.id === draggedTask.id)
    const targetIndex = tasksCopy.findIndex((t) => t.id === targetTask.id)

    tasksCopy.splice(draggedIndex, 1)
    tasksCopy.splice(targetIndex, 0, draggedTask)

    dispatch({ type: "REORDER_TASKS", payload: tasksCopy })
    setDraggedTask(null)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500 hover:bg-red-600"
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "low":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-blue-500 hover:bg-blue-600"
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No tasks found. Add a new task to get started!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <Card
          key={task.id}
          className={`shadow-sm transition-all ${task.completed ? "opacity-70" : ""}`}
          draggable
          onDragStart={(e) => handleDragStart(e, task)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, task)}
        >
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <Checkbox
                id={`task-${task.id}`}
                checked={task.completed}
                onCheckedChange={() => handleToggleComplete(task.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                  >
                    {task.title}
                  </label>
                  <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                </div>
                <p className={`mt-1 text-sm ${task.completed ? "text-muted-foreground" : ""}`}>{task.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">{new Date(task.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 pt-0">
            <Button variant="outline" size="sm" onClick={() => onEditTask(task)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDeleteTask(task.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}

      <AlertDialog open={!!deleteTaskId} onOpenChange={() => setDeleteTaskId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTask}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

