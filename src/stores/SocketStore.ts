// errorHandlingStore.js
import {defineStore} from 'pinia';
import {useCookies} from "vue3-cookies";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL
const $cookies = useCookies()

function getWsUrl(): string {
  let url = BASE_URL.replace('http', 'ws');
  url = url.replace('https', 'ws');
  url = url + '/ws';
  return url
}

enum WebSocketMessageType {
    UserAuthentication= 'UserAuthentication',
    User= 'User',
    Agent= 'Agent',
    Printer = 'Printer',
    Error = 'Error',
}

class WebSocketMessage {
  public body: string;
  public message_type: WebSocketMessageType;

 constructor(body: string, message_type: WebSocketMessageType) {
   this.body = body;
   this.message_type = message_type;
 }
}

export const useSocketStore = defineStore('socketStore', {
  state: () => ({
    socket: null as WebSocket | null,
  }),
  actions: {
    isConnected() {
      return this.socket?.readyState === WebSocket.OPEN || this.socket !== null;
    },

    connect() {
      this.socket = new WebSocket(getWsUrl());

      // on socket open (connection established)
      this.socket.onopen = () => {
        console.info(`WS:Connection OK ✅ - Time: ${new Date().toLocaleTimeString()}`)
        console.log('WS:Authentication handshake')

        let token = $cookies.cookies.get('token')
        const message = new WebSocketMessage(token, WebSocketMessageType.UserAuthentication)
        this.socket?.send(JSON.stringify(message))
      };

      // on socket message
      this.socket.onmessage = (event) => {
          console.info(`WS:Received data`)
          console.log(JSON.parse(event.data))
      };

      // on socket close
      this.socket.onclose = () => {
        console.error(`WS:Disconnected`)
        this.socket = null
      };

    },

    disconnect() {
      this.socket?.close()

    },

    send(message: string) {
      this.socket?.send(message);
    },
  },
});


