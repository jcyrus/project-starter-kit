import axios from "axios";
import Cookies from "js-cookie";
import type {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class AuthService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
  });

  constructor() {
    // Add token to requests if available
    this.api.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle token refresh or logout on 401
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>(
      "/auth/login",
      credentials
    );
    const { user, token } = response.data;

    // Store token in secure cookie
    Cookies.set("auth_token", token, {
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return response.data;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>(
      "/auth/register",
      credentials
    );
    const { user, token } = response.data;

    // Store token in secure cookie
    Cookies.set("auth_token", token, {
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return response.data;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await this.api.get<User>("/auth/me");
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.post("/auth/logout");
    } catch (error) {
      // Continue with logout even if API call fails
      console.error("Logout API call failed:", error);
    } finally {
      Cookies.remove("auth_token");
    }
  }

  getToken(): string | null {
    return Cookies.get("auth_token") || null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
