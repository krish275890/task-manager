"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"

export type Priority = "low" | "medium" | "high"

export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  createdAt: string
  priority: Priority
}

type TaskState = {
  tasks: Task[]
}

type TaskAction =
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "TOGGLE_COMPLETE"; payload: string }
  | { type: "REORDER_TASKS"; payload: Task[] }

type TaskDispatch = (action: TaskAction) => void

const TaskContext = createContext<TaskState | undefined>(undefined)
const TaskDispatchContext = createContext<TaskDispatch | undefined>(undefined)

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case "ADD_TASK":
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      }
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.payload.id ? action.payload : task)),
      }
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      }
    case "TOGGLE_COMPLETE":
      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.payload ? { ...task, completed: !task.completed } : task)),
      }
    case "REORDER_TASKS":
      return {
        ...state,
        tasks: action.payload,
      }
    default:
      return state
  }
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, { tasks: [] })

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks)
      parsedTasks.forEach((task: Task) => {
        dispatch({ type: "ADD_TASK", payload: task })
      })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(state.tasks))
  }, [state.tasks])

  return (
    <TaskContext.Provider value={state}>
      <TaskDispatchContext.Provider value={dispatch}>{children}</TaskDispatchContext.Provider>
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider")
  }
  return context
}

export function useTaskDispatch() {
  const context = useContext(TaskDispatchContext)
  if (context === undefined) {
    throw new Error("useTaskDispatch must be used within a TaskProvider")
  }
  return context
}

