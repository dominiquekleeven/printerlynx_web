// errorHandlingStore.js
import {defineStore} from 'pinia';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL

const HEARTBEAT_MESSAGE = 'Ping'
const HEARTBEAT_RESPONSE = 'Pong'
const HEARTBEAT_INTERVAL = 5000

const MAX_RETRIES = 30
const RETRY_INTERVAL = 5000

export const useSocketStore = defineStore('socketStore', {
  state: () => ({
    socket: null as WebSocket | null,
    message_count: 0,
  }),
  actions: {
    isConnected() {
      return this.socket?.readyState === WebSocket.OPEN;
    },

    connect() {
      let url = BASE_URL.replace('http', 'ws');
      url = url.replace('https', 'ws');
      url = url + '/ws';
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        console.info(`WS:Connection OK ✅ - Time: ${new Date().toLocaleTimeString()}`)

        setInterval(() => {
          this.send(HEARTBEAT_MESSAGE)
        }, HEARTBEAT_INTERVAL)
      };

      this.socket.onmessage = (event) => {
        this.message_count += 1

        if (event.data === HEARTBEAT_RESPONSE) {
          console.info(`WS:Heartbeat 🔄 - Timestamp: ${Date.now()}`)
        } else {
          console.info(`WS:Received data: ${event.data}`)
        }
      };

      this.socket.onclose = () => {
        console.error(`WS:Disconnected`)
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


