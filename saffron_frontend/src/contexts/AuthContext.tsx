import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const API_URL = import.meta.env.VITE_API_URL as string;

interface User {
  _id: string;
  fullName: string;
  email: string;
  isAdmin: boolean;
  role?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string, deviceId?: string) => Promise<{ error: any; data?: any }>;
  verifyOtp: (userId: string, otp: string, deviceId: string) => Promise<{ error: any }>;
  signInWithGoogle: (token: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateUserData: (updatedUser: Partial<User>) => void;
  forgotPassword: (email: string) => Promise<{ error: any; resetToken?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("saffron_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("saffron_user");
      }
    }
    setIsLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string, deviceId?: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName, deviceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      if (data.otpRequired) {
        return { error: null, data };
      }

      setUser(data);
      localStorage.setItem("saffron_user", JSON.stringify(data));
      return { error: null, data };
    } catch (error: any) {
      return { error: error.message, data: null };
    }
  };

  const signIn = async (email: string, password: string, deviceId?: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, deviceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // If OTP is required, we return early and let the component handle it
      if (data.otpRequired) {
        return { error: null, data };
      }

      setUser(data);
      localStorage.setItem("saffron_user", JSON.stringify(data));
      return { error: null, data };
    } catch (error: any) {
      return { error: error.message || "Login failed", data: null };
    }
  };

  const verifyOtp = async (userId: string, otp: string, deviceId: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp, deviceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP Verification failed");
      }

      setUser(data);
      localStorage.setItem("saffron_user", JSON.stringify(data));
      return { error: null, data };
    } catch (error: any) {
      return { error: error.message || "Verification failed", data: null };
    }
  };

  const signInWithGoogle = async (token: string, deviceId?: string) => {
    try {
      // Send as both so backend can decide which one it is
      const response = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId: token, accessToken: token, deviceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Google login failed");
      }

      // Handle OTP requirement if backend implements it for Google
      if (data.otpRequired) {
        return { error: null, data };
      }

      setUser(data);
      localStorage.setItem("saffron_user", JSON.stringify(data));
      return { error: null, data };
    } catch (error: any) {
      return { error: error.message || "Google login failed", data: null };
    }
  };

  const signOut = async () => {
    localStorage.removeItem("saffron_user");
    setUser(null);
  };

  const updateUserData = (updatedFields: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const newUser = { ...prevUser, ...updatedFields };
      localStorage.setItem("saffron_user", JSON.stringify(newUser));
      return newUser;
    });
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log("Forgot Password Response:", response.status);

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      return { error: null, resetToken: data.resetToken };
    } catch (error) {
      return { error, resetToken: undefined };
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Reset failed");
      }

      return { error: null };
    } catch (error: any) {
      return { error: error.message || "Password reset failed", data: null };
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signUp, signIn, verifyOtp, signInWithGoogle, signOut, updateUserData, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
