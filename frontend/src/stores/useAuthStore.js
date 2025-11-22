import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (data) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.post("/auth/login", data, {
        withCredentials: true, 
      });

      const { user } = response.data;

      set({ user, isLoading: false, error: null });
      return user;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Login failed. Please try again.";
      set({ error: errorMsg, isLoading: false });
      console.error("Login error:", errorMsg);
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
      set({ user: null, isLoading: false });
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Logout failed. Please try again.";
      set({ error: errorMsg, isLoading: false });
    }
  },

  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/auth/me", {
        withCredentials: true,
      });

      const { user } = response.data;
      set({ user, isLoading: false });
      return user;
    } catch (error) {
      set({ user: null, isLoading: false });
      console.log("Not authenticated or session expired");
    }
  },
}));
