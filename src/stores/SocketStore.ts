// errorHandlingStore.js
import {defineStore} from 'pinia';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL

const HEARTBEAT_MESSAGE = 'Ping'
const HEARTBEAT_RESPONSE = 'Pong'
const HEARTBEAT_INTERVAL = 5000

function getWsUrl(): string {
  let url = BASE_URL.replace('http', 'ws');
  url = url.replace('https', 'ws');
  url = url + '/ws';
  return url
}

export const useSocketStore = defineStore('socketStore', {
  state: () => ({
    socket: null as WebSocket | null,
    message_count: 0,
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
        setInterval(() => {
          this.send(HEARTBEAT_MESSAGE)
        }, HEARTBEAT_INTERVAL)
      };

      // on socket message
      this.socket.onmessage = (event) => {
        this.message_count += 1
        if (event.data === HEARTBEAT_RESPONSE) {
          console.info(`WS:Heartbeat 🔄 - Timestamp: ${Date.now()}`)
        } else {
          console.info(`WS:Received data: ${event.data}`)
        }
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


