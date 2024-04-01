import { AUTH_CONSTANTS } from "@/constants/auth.constants";
import { ResponseLoginDto, ResponseLogoutDto, ResponseMeDto } from "@/types";
import axios, { AxiosInstance } from "axios";

const { ME, LOGIN, LOGOUT, BASE } = AUTH_CONSTANTS;

class AuthService {
  public readonly instance: AxiosInstance;
  public constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async me(token: string) {
    this.instance.defaults.headers["Authorization"] = "Bearer " + token;
    return this.instance.get<ResponseMeDto>(ME);
  }

  async login(username: string, password: string) {
    return this.instance.post<ResponseLoginDto>(
      LOGIN,
      {
        username,
        password,
      },
      {
        withCredentials: true,
      }
    );
  }

  async logout() {
    return this.instance.post<ResponseLogoutDto>(
      LOGOUT,
      {},
      { withCredentials: true }
    );
  }
}

const authService = new AuthService(
  process.env.NEXT_PUBLIC_API_URL + BASE || ""
);
export default authService;
