
import axiosInstance from "./axiosInstance";

export interface Appointment {
  id: string;
  name: string;
  email: string;
  contact_number: string;
  date: string;
  time: string;
  reason_of_meeting: string;
  your_expectation: string;
  more_details: string;
  view: boolean;
  createdAt: string;
  updatedAt: string;
}

export const fetchAppointments = async (): Promise<Appointment[]> => {
  const response = await axiosInstance.get("/appointment/get-all");
  return response.data.data;  
};

export const markAppointmentAsViewed = async (
  id: string
): Promise<Appointment> => {
  const response = await axiosInstance.get(`/appointment/get/${id}`);
  return response.data; 
};



