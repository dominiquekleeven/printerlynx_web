// errorHandlingStore.js
import {defineStore} from 'pinia';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL
const HEARTBEAT_MESSAGE = 'Ping'
const HEARTBEAT_RESPONSE = 'Pong'
const HEARTBEAT_INTERVAL = 10000

export const useSocketStore = defineStore('socketStore', {
  state: () => ({
    socket: null as WebSocket | null,
    message: '',
    // We will store a list of agents and their state here and a list of printers and their state
  }),
  actions: {
    isConnected() {
      return this.socket?.readyState === WebSocket.OPEN;
    },
    connect() {
      let url = BASE_URL.replace('http', 'ws'); //HTTP
      url = url.replace('https', 'ws'); //HTTPS
      url = url + '/ws'; //WEBSOCKET
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        console.info(`WS:Connection OK ✅ - Time: ${new Date().toLocaleTimeString()}`)
        this.send(HEARTBEAT_MESSAGE)
      };

      this.socket.onmessage = (event) => {

        if (event.data === HEARTBEAT_RESPONSE) {
          console.info(`WS:Heartbeat 🔄 - Time: ${new Date().toLocaleTimeString()}`)
        } else {
          console.info(`WS:Received data: ${event.data}`)
        }
        setTimeout(() => {
          this.send(HEARTBEAT_MESSAGE)
        }, HEARTBEAT_INTERVAL)
      };

      this.socket.onclose = () => {
        console.error(`WS:Disconnected`)
      };

    },
    disconnect() {
      console.info('WS:Disconnecting...')
      this.socket?.close();
    },
    send(message: string) {
      this.socket?.send(message);
    },
  },
});


