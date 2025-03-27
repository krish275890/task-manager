"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTaskDispatch, type Task, type Priority } from "./task-context"
import { v4 as uuidv4 } from "uuid"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface TaskFormProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
}

export default function TaskForm({ task, isOpen, onClose }: TaskFormProps) {
  const dispatch = useTaskDispatch()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setPriority(task.priority)
    } else {
      setTitle("")
      setDescription("")
      setPriority("medium")
    }
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    if (task) {
      // Update existing task
      dispatch({
        type: "UPDATE_TASK",
        payload: {
          ...task,
          title,
          description,
          priority,
        },
      })
    } else {
      // Create new task
      dispatch({
        type: "ADD_TASK",
        payload: {
          id: uuidv4(),
          title,
          description,
          completed: false,
          createdAt: new Date().toISOString(),
          priority,
        },
      })
    }

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{task ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

