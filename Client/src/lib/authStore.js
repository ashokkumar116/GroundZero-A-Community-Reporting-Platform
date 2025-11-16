import toast from "react-hot-toast";
import axios from "../Services/axios";
import { create } from "zustand";
import {persist} from "zustand/middleware"

export const useAuthStore = create(persist((set, get) => ({
    user: null,
    error: null,
    loading:false,
    loginLoading:false,
    login: async ({ email, password }) => {
        try {
            if (!email || !password) {
                toast.error("Please provide all the details");
                set({ error: "Please provide all the details" });
                return false;
            }
            set({loginLoading:true});
            const res = await axios.post("/auth/login", { email, password });
            if (res.status === 200) {
                set({ user: res.data.user });
                return true;
            }
        } catch (error) {
            console.error("Login failed:", error);
            toast.error(error.response.data.message);
            set({ error: error.response.data.message });
            return false;
        }finally{
            set({loginLoading:false});
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
            set({loginLoading:false})
        }
    },
    logout:async()=>{
        try {
            await axios.post('/auth/logout');
            set({user:null,error:null});
        } catch (error) {
            set({error:error});
        }
    },
    upadateProfileImage:(profile_image)=>{
        const user = get().user;
        if(user){
            user.profile_image = profile_image;
            set({user});
        }
    }
}),{
    name:"auth-storage",
}));
