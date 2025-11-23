import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

interface User {
  _id: string;
  fullName?: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  login: (data: { email: string; password: string }) => Promise<User | null>;
  signup: (data: { fullName: string; email: string; password: string }) => Promise<User | null>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  // LOGIN
  login: async (data) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.post("/auth/login", data, {
        withCredentials: true,
      });

      const user: User = response.data.user ?? response.data; // handle different shapes
      if (!user || !user._id) {
        throw new Error(response.data?.message || "Invalid response from server");
      }

      // persist minimal id locally (your existing behavior)
      localStorage.setItem("userId", user._id);

      toast.success("Login successful!");
      set({ user, isLoading: false, error: null });
      return user;
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message || "Login failed. Please try again.";
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
      console.error("Login error:", errorMsg);
      return null;
    }
  },

  // SIGNUP
  signup: async (data) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.post("/auth/signup", data, {
        withCredentials: true,
      });

      const user: User = response.data.user ?? response.data;
      if (!user || !user._id) {
        throw new Error(response.data?.message || "Invalid response from server");
      }

      // same persistence behavior as before
      localStorage.setItem("userId", user._id);

      toast.success("Account created successfully!");
      set({ user, isLoading: false, error: null });
      return user;
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message || "Signup failed. Please try again.";
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
      console.error("Signup error:", errorMsg);
      return null;
    }
  },

  // LOGOUT
  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      await axiosInstance.post("/auth/logout", {}, { withCredentials: true });

      // cleanup local persistence
      localStorage.removeItem("userId");

      set({ user: null, isLoading: false, error: null });
      toast.success("Logged out.");
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message || "Logout failed. Please try again.";
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
      console.error("Logout error:", errorMsg);
    }
  },
}));
