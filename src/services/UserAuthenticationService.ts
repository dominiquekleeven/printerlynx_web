import type {AxiosPromise} from "axios";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL

export class UserAuthenticationService {
  public async login(username: string, password: string): Promise<AxiosPromise> {
    try {
      return await axios.post(BASE_URL + '/api/v1/auth/login', {
        username: username,
        password: password
      });
    } catch (e: any) {
      return e;
    }
  }

  public async register(username: string, email: string, password: string, passwordConfirmation: string): Promise<AxiosPromise> {
    try {
      return await axios.post(BASE_URL + '/api/v1/auth/register', {
        username: username,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation
      });
    } catch (e: any) {
      return e;
    }
  }

  public async getUserInfo(token: string): Promise<AxiosPromise> {
    try {
      return await axios.get(BASE_URL + '/api/v1/accounts/info', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
    } catch (e: any) {
      return e;
    }
  }
}