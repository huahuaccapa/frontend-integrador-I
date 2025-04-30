import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { useTheme } from "./theme-provider"


export function Modetoggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="w-6 h-6 rotate-0 scale-100 transition-all dark:rotate-[-90deg] dark:scale-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="w-6 h-6 rotate-0 scale-100 transition-all dark:rotate-[-90deg] dark:scale-0" />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="absolute w-6 h-6 rotate-[90deg] scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
