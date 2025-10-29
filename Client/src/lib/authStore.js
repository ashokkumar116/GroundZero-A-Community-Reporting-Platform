import axios from "../Services/axios";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
    user: null,
    error: null,
    loading:false,
    login: async ({ email, password }) => {
        try {
            set({loading:true});
            const res = await axios.post("/auth/login", { email, password });
            if (res.status === 200) {
                set({ user: res.data.user });
                return true;
            }
        } catch (error) {
            console.error("Login failed:", error);
            set({error:error.response?.data?.message || "Login failed"});
            return false;
        }finally{
            set({loading:false});
        }
    },
    verifyAuth: async () => {
        try {
            set({loading:true});
            const res = await axios.get('/auth/me');
            if(res.status === 200){
                set({user: res.data.user});
            }
        } catch (error) {
            console.error("Auth verification failed:", error);
            set({user: null});
            set({error: "Auth verification failed"});
        }finally{
            set({loading:false});
        }
    },
    logout:async()=>{
        try {
            await axios.post('/auth/logout');
            set({user:null,error:null});
        } catch (error) {
            set({error:error});
        }
    }
}));
