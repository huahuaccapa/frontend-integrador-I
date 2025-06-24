import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import {Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, 
SidebarMenuButton, SidebarMenuItem,} from "@/components/ui/sidebar"
import { NavLink } from "react-router-dom";

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
        
        <SidebarHeader>
        
            <div>
                <div className="text-indigo-400 font-bold text-xl text-white mb-6">
                            Multiservis Nico
                    <div className="flex shrink-0 items-center">
                        <img
                        alt="Your Company"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREayWE3odb7eT-UL3xhc96tM-7kob4BYrxvA&s"
                        className="h-30 w-30 rounded-full"
                        />
                    </div>
                </div>
            </div>
        </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}