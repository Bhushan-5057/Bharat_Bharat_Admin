// import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string
//       name: string
//       email: string
//       role: string 
//       city?: string
//     } & DefaultSession["user"]
//   }

//   interface User extends DefaultUser {
//     role?: string 
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     user?: {
//       id: string
//       name: string
//       email: string
//       role: string
//       city?: string
//     }
//   }
// }

// interface Client {
//   id: number;
//   name: string;
//   profilePicture: string;
//   review: string;
// }
// interface ClientType {
//   id: number;
//   name: string;
//   profilePicture: string;
//   review: string;
// }

// interface ClientState {
//   data: {
//     count: number;
//     rows: Client[];
//   } | null;
//   loading: boolean;
//   error: string | null;
// }

// type Opening = {
//   id: string;
//   image?: string;
//   job_title: string;
//   experience: number;
//   location: string;
//   description: string;
// };



// export interface Notification {
//   id: number;
//   first_name: string;
//   last_name: string;
//   email: string;
//   current_location?: string;
//   created_at: string; 
// }

import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      city?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id: string;
      name: string;
      email: string;
      role: string;
      city?: string;
    };
  }
}

interface Client {
  id: number;
  name: string;
  profilePicture: string;
  review: string;
}
interface ClientType {
  id: number;
  name: string;
  profilePicture: string;
  review: string;
}

interface ClientState {
  data: {
    count: number;
    rows: Client[];
  } | null;
  loading: boolean;
  error: string | null;
}

type Opening = {
  id: string;
  image?: string;
  job_title: string;
  experience: number;
  location: string;
  description: string;
};

export interface Notification {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  current_location?: string;
  created_at: string;
}
