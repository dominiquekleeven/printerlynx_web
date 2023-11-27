// errorHandlingStore.js
import {defineStore} from 'pinia';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL

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
      let url = BASE_URL.replace('http', 'ws');
      url = url.replace('https', 'ws');
      url = url + '/ws';

      console.log(`WS:Connecting...`)
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        console.log(`WS:Connected`)
      };

      this.socket.onmessage = (event) => {
        console.log(`WS:Message: ${event.data}`)
        this.message = event.data;
      };

      this.socket.onclose = () => {
        console.log(`WS:Disconnected`)
      };

    },
    disconnect() {
      console.warn('WS:Disconnecting...')
      this.socket?.close();
    },
    send(message: string) {
      this.socket?.send(message);
    },

  },
});


