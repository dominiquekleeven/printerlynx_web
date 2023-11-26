import type {AxiosPromise} from "axios";
import axios from "axios";
import {useCookies} from "vue3-cookies";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL
const $cookies = useCookies()

export class AgentService {

  public async getAgents(): Promise<AxiosPromise> {
    const token = $cookies.cookies.get('token')
    if (token === undefined || token === null) {
      return Promise.reject('No token found')
    }
    try {
      return await axios.get(BASE_URL + '/api/v1/agents', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
    } catch (e: any) {
      return e;
    }

  }

  public async addAgent(name: string, description: string): Promise<AxiosPromise> {
    const token = $cookies.cookies.get('token')
    if (token === undefined || token === null) {
      return Promise.reject('No token found')
    }

    try {
      return await axios.post(BASE_URL + '/api/v1/agents', {
        name: name,
        description: description
      }, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
    } catch (e: any) {
      return e;
    }
  }

  public async deleteAgent(agentUuid: string): Promise<AxiosPromise> {
    const token = $cookies.cookies.get('token')
    if (token === undefined || token === null) {
      return Promise.reject('No token found')
    }

    try {
      return await axios.delete(BASE_URL + '/api/v1/agents/' + agentUuid, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
    } catch (e: any) {
      return e;
    }

  }


}