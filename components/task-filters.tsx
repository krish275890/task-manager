"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface TaskFiltersProps {
  sortBy: string
  filterBy: string
  onSortChange: (value: any) => void
  onFilterChange: (value: any) => void
}

export default function TaskFilters({ sortBy, filterBy, onSortChange, onFilterChange }: TaskFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="space-y-2 flex-1">
        <Label htmlFor="filter">Filter by</Label>
        <Select value={filterBy} onValueChange={onFilterChange}>
          <SelectTrigger id="filter">
            <SelectValue placeholder="Filter tasks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 flex-1">
        <Label htmlFor="sort">Sort by</Label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger id="sort">
            <SelectValue placeholder="Sort tasks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Date (newest first)</SelectItem>
            <SelectItem value="priority">Priority (highest first)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

