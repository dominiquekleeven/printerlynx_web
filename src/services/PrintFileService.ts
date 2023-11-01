import type {AxiosPromise} from "axios";
import axios from "axios";
import {useCookies} from "vue3-cookies";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL
const gcodeUploadURLv1 = `${BASE_URL}/api/v1/files/upload`
const $cookies = useCookies()

export class PrintFileService {

  public async getFiles(): Promise<AxiosPromise> {
    const token = $cookies.cookies.get('token')
    if (token === undefined || token === null) {
      return Promise.reject('No token found')
    }
    try {
      return await axios.get(BASE_URL + '/api/v1/files', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
    } catch (e: any) {
      return e;
    }

  }

  public async getFile(fileUuid: string): Promise<AxiosPromise> {
    const token = $cookies.cookies.get('token')
    if (token === undefined || token === null) {
      return Promise.reject('No token found')
    }
    try {
      return await axios.get(BASE_URL + '/api/v1/files/' + fileUuid, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
    } catch (e: any) {
      return e;
    }
  }


  public async uploadFile(file: any): Promise<AxiosPromise> {
    const token = $cookies.cookies.get('token')
    if (token === undefined || token === null) {
      return Promise.reject('No token found')
    }

    try {
      let formData = new FormData();
      formData.append('file', file);

      return await axios.post(gcodeUploadURLv1, formData, {
        headers: {
          'content-type': 'multipart/form-data',
          'Authorization': 'Bearer ' + token
        }
      });
    } catch (e: any) {
      return e;
    }
  }

  public async deleteFile(fileUuid: string): Promise<AxiosPromise> {
    const token = $cookies.cookies.get('token')
    if (token === undefined || token === null) {
      return Promise.reject('No token found')
    }

    try {
      return await axios.delete(BASE_URL + '/api/v1/files/' + fileUuid, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
    } catch (e: any) {
      return e;
    }

  }


}