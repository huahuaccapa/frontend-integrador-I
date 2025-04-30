import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/custom/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoLogOutOutline, IoSettingsOutline, IoPersonOutline } from "react-icons/io5";

import { useAuth } from "../providers/UserContext";

export const UserNav = () => {
  const { user, logoutUser } = useAuth();
  const currentUser = user || JSON.parse(localStorage.getItem('user')) || { full_name: 'Usuario', email: 'correo@ejemplo.com' };

  function extractInitials(name) {
    if (!name) return "U"; // Valor predeterminado si no hay nombre
    const words = name.split(" ");
    let initials = "";
    let count = 0;
    for (let i = 0; i < words.length && count < 2; i++) {
      if (
        words[i].toLowerCase() !== "de" &&
        words[i].toLowerCase() !== "la" &&
        words[i].toLowerCase() !== "el" &&
        words[i].toLowerCase() !== "los" &&
        words[i].toLowerCase() !== "las"
      ) {
        initials += words[i][0].toUpperCase();
        count++;
      }
    }
    return initials || "U"; // Valor predeterminado si no se encuentran iniciales
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{extractInitials(currentUser.full_name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{currentUser.full_name || 'Usuario'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser.email || 'correo@ejemplo.com'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to="/ajustes">
            <DropdownMenuItem style={{ cursor: "pointer" }}>
              Perfil
              <DropdownMenuShortcut>
                <IoPersonOutline style={{ fontSize: "18px" }} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link to="/ajustes">
            <DropdownMenuItem style={{ cursor: "pointer" }}>
              Ajustes
              <DropdownMenuShortcut>
                <IoSettingsOutline style={{ fontSize: "18px" }} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          style={{ cursor: "pointer" }}
          onClick={() => logoutUser()}
        >
          Cerrar Sesión
          <DropdownMenuShortcut>
            <IoLogOutOutline style={{ fontSize: "18px" }} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
