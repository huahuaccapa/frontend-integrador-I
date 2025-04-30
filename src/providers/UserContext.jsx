import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  useMemo,
} from "react";

const backend_host = import.meta.env.VITE_BACKEND_HOST;

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { toast } = useToast();
  const [authTokens, setAuthTokens] = useState(() => {
    return localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null;
  });
  const [user, setUser] = useState(() => {
    return localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
  });

  const loginUser = async (credentials) => {
    try {
      const response = await axios.post(
        `${backend_host}/api/v1/auth/login`,
        {
          username: credentials.username,
          password: credentials.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Login Response:", response);

      if (response.status === 200) {
        const { access_token, user } = response.data;

        console.log("Received user:", user);
        console.log("Received token:", access_token);

        if (access_token) {
          localStorage.setItem("authTokens", JSON.stringify({ access_token }));
          localStorage.setItem("user", JSON.stringify(user));

          setAuthTokens({ access_token });
          setUser(user);

          // Redirigir según el rol del usuario
          if (user.roleType === "COORDINATOR") {
            window.location.href = "/admin/dashboard";
          } else if (user.roleType === "STUDENT") {
            window.location.href = "/student/dashboard";
          } else {
            window.location.href = "/dashboard";
          }
        } else {
          console.error("Token no recibido.");
        }
      } else {
        console.error("Error en la autenticación");
      }
    } catch (error) {
      console.error("Error en loginUser:", error);
      toast({
        title: "Error de autenticación",
        description: "Hubo un problema al iniciar sesión. Por favor, verifica tus credenciales.",
      });
    }
  };

  const logoutUser = async () => {
    toast({
      title: "Cerrando sesión",
      description: "Tu sesión se ha cerrado exitosamente.",
    });

    try {
      if (authTokens) {
        await axios.delete(
          `${backend_host}/api/v1/general/users/sign_out`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + authTokens.access_token,
            },
          }
        );
      }
    } catch (error) {
      console.error(
        "Error en logoutUser:",
        error.response ? error.response.data : error.message
      );
    } finally {
      localStorage.removeItem("authTokens");
      localStorage.removeItem("user");
      setAuthTokens(null);
      setUser(null);
      window.location.href = "/sign-in";
    }
  };

  useEffect(() => {
    const axiosInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          logoutUser();
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(axiosInterceptor);
  }, []);

  useEffect(() => {
    const axiosInterceptor = axios.interceptors.request.use(
      (config) => {
        if (authTokens) {
          config.headers.Authorization = `Bearer ${authTokens.access_token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    return () => axios.interceptors.request.eject(axiosInterceptor);
  }, [authTokens]);
  

  const contextData = useMemo(
    () => ({
      user,
      authTokens,
      loginUser,
      logoutUser,
      setAuthTokens,
      setUser,
    }),
    [user, authTokens]
  );

  return (
    <UserContext.Provider value={contextData}>{children}</UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
