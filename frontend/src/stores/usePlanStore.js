import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const usePlanStore = create((set) => ({
    singlePlan: null,
    totalPlans: null,
    angles: null,
    isLoading: false,
    error: null,

    getPlanDetails: async (id) => {
        set({ isLoading: true, error: null });

        try {
            const response = await axiosInstance.get(`/dashboard/${id}`);
            set({ singlePlan: response.data });
        } catch (error) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    loadData: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await axiosInstance.get("/dashboard/getPlans");
            set({ totalPlans: response.data.plan });
        } catch (error) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    refPose: async (poseId) => {
        set({ isLoading: true, error: null , });

        try {
            const response = await axiosInstance.get(`/dashboard/reference/${poseId}`);
            console.log("Zustand log :",response.data);
            set({ angles: response.data });
        } catch (error) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });

        }
    },

    markDone: async (planId,poseId) => {
        set({ isLoading: true, error: null  });

        try {
            const response = await axiosInstance.post(`/dashboard/${planId}/${poseId}`);
            console.log("Zustand log :",response);
            return true;
        } catch (error) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });

        }
    },

    resetAngles: () => {
        set({angles: null})
    }
}));
