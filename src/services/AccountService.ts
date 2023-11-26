import type {AxiosPromise} from "axios";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL

export class AccountService {
  public async getAccountInfo(token: string): Promise<AxiosPromise> {
    try {
      return await axios.get(BASE_URL + '/api/v1/accounts/me', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
    } catch (e: any) {
      return e;
    }
  }
}