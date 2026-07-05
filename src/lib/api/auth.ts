import { apiClient } from "./client";
import { UserProfile } from "./types";

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface SignupDetails {
  name: string;
  email: string;
  password?: string;
}

// In-memory active user session storage (simulates browser JWT token/localStorage)
let currentUser: UserProfile | null = {
  id: "usr_alex_mercer",
  name: "Alex Mercer",
  email: "alex.mercer@forgemind.ai",
  role: "Admin"
};

export const authApi = {
  // Login handler
  async login(credentials: LoginCredentials): Promise<UserProfile> {
    // Mock user profile on successful authentication
    const user: UserProfile = {
      id: "usr_alex_mercer",
      name: credentials.email.split("@")[0].replace(".", " "),
      email: credentials.email,
      role: "Admin"
    };

    currentUser = user;
    if (typeof window !== "undefined") {
      localStorage.setItem("forgemind_token", "mock-jwt-token-string");
    }

    return apiClient<UserProfile>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      mockData: user
    });
  },

  // Signup handler
  async signup(details: SignupDetails): Promise<UserProfile> {
    const user: UserProfile = {
      id: `usr_${Date.now()}`,
      name: details.name,
      email: details.email,
      role: "Analyst"
    };

    currentUser = user;
    if (typeof window !== "undefined") {
      localStorage.setItem("forgemind_token", "mock-jwt-token-string");
    }

    return apiClient<UserProfile>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(details),
      mockData: user
    });
  },

  // Get active session user info
  async getCurrentUser(): Promise<UserProfile | null> {
    return apiClient<UserProfile | null>("/auth/profile", {
      mockData: currentUser
    });
  },

  // Logout handler
  async logout(): Promise<{ success: boolean }> {
    currentUser = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("forgemind_token");
    }

    return apiClient<{ success: boolean }>("/auth/logout", {
      method: "POST",
      mockData: { success: true }
    });
  }
};
