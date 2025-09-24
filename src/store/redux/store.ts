import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slice/authSlice';
import userReducer from '../redux/slice/userSlice';
import bannerReducer from '../redux/slice/bannerSlice';
import serviceReducer from '../redux/slice/serviceSlice';
import officeBearerReducer from '../redux/slice/officeBearerSlice';
import publicationReducer from "./slice/publicationSlice"
import educationReducer from '@/store/redux/slice/educationSlice'
import eventReducer from "./slice/eventSlice";
import activityReducer from "./slice/activitySlice";
import cityReducer from "./slice/citySlice";
import dashboardReducer from "./slice/dashboardSlice";
import photoReducer from '@/store/redux/slice/photoSlice'; 
import videoReducer from '@/store/redux/slice/videoSlice';
import donationReducer from '@/store/redux/slice/donationSlice';
import blogsReducer from "@/store/redux/slice/blogSlice";
import appointmentReducer from '@/store/redux/slice/appointmentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    banner: bannerReducer,
    service: serviceReducer,
    officeBearer: officeBearerReducer,
    publications: publicationReducer,
    education: educationReducer,
    events: eventReducer,
    activities: activityReducer,
    cities: cityReducer,
    dashboard: dashboardReducer,
    blogs:blogsReducer,
     photos: photoReducer,
    video: videoReducer,
    donation: donationReducer,
     appointment: appointmentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


