import { ChevronDown } from 'lucide-react'
import { useState, forwardRef } from 'react'
import { clsx } from 'clsx'

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  name?: string
}

interface SelectTriggerProps {
  children: React.ReactNode
  className?: string
  id?: string
}

interface SelectContentProps {
  children: React.ReactNode
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
}

const Select = ({ value, onValueChange, children, name }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <input type="hidden" name={name} value={value} />
      <div className="relative">
        {children}
      </div>
    </div>
  )
}

const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ children, className, id }, ref) => {
    return (
      <button
        type="button"
        className={clsx(
          'flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        id={id}
        onClick={(e) => {
          e.preventDefault()
          const select = e.currentTarget.closest('.relative')?.querySelector('select') as HTMLSelectElement
          if (select) {
            select.click()
          }
        }}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
    )
  }
)

SelectTrigger.displayName = 'SelectTrigger'

const SelectValue = () => null

const SelectContent = ({ children }: SelectContentProps) => {
  return (
    <select 
      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
      onChange={(e) => {
        const selectComponent = e.target.closest('.relative')?.parentElement
        const onValueChange = (selectComponent as any)?._onValueChange
        if (onValueChange) {
          onValueChange(e.target.value)
        }
      }}
    >
      {children}
    </select>
  )
}

const SelectItem = ({ value, children }: SelectItemProps) => {
  return (
    <option value={value}>
      {children}
    </option>
  )
}

// 简化的Select实现
const SimpleSelect = ({ value, onValueChange, children, className, id }: {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
  id?: string
}) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={clsx(
          'flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer',
          className
        )}
        id={id}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
    </div>
  )
}

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SimpleSelect
}