import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slice/authSlice';
import userReducer from '../redux/slice/userSlice';
import bannerReducer from '../redux/slice/bannerSlice';
import serviceReducer from '../redux/slice/serviceSlice';
import officeBearerReducer from '../redux/slice/officeBearerSlice';
import publicationReducer from "./slice/publicationSlice"
import achievementReducer from '@/store/redux/slice/achievementSlice'
import eventReducer from "./slice/eventSlice";
import activityReducer from "./slice/activitySlice";
import cityReducer from "./slice/citySlice";
import photoReducer from '@/store/redux/slice/photoSlice'; 
import videoReducer from '@/store/redux/slice/videoSlice';
import donationReducer from '@/store/redux/slice/donationSlice';
import contactDetailsReducer from '@/store/redux/slice/contactDetailsSlice';
import blogsReducer from "@/store/redux/slice/blogSlice";
import appointmentReducer from '@/store/redux/slice/appointmentSlice';
import memberReducer from '@/store/redux/slice/memberSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    banner: bannerReducer,
    service: serviceReducer,
    officeBearer: officeBearerReducer,
    publications: publicationReducer,
    achievements: achievementReducer,
    events: eventReducer,
    activities: activityReducer,
    cities: cityReducer,
    blogs:blogsReducer,
    photos: photoReducer,
    video: videoReducer,
    donation: donationReducer,
    contactDetails: contactDetailsReducer,
    member: memberReducer,
     appointment: appointmentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

