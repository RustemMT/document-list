import { ChatMessage } from "@/types/chat";

const WEBSOCKET_URL = "wss://ws.ifelse.io";

export const chatService = {
  ws: null as WebSocket | null,
  messageHandlers: [] as ((message: ChatMessage) => void)[],
  errorHandlers: [] as ((error: Error) => void)[],

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(WEBSOCKET_URL);

        this.ws.onopen = () => {
          console.log("WebSocket подключен");
          resolve();
        };

        this.ws.onmessage = (event) => {
          const assistantMessage: ChatMessage = {
            id: Date.now().toString(),
            text: event.data,
            sender: "assistant",
            timestamp: new Date(),
          };
          this.messageHandlers.forEach((h) => h(assistantMessage));
        };

        this.ws.onerror = (event) => {
          const errorObj = new Error("Ошибка WebSocket соединения");
          console.error("WebSocket ошибка:", event);
          this.errorHandlers.forEach((h) => h(errorObj));
          reject(errorObj);
        };

        this.ws.onclose = (event) => {
          console.log("WebSocket отключен", event.code, event.reason);
        };
      } catch (error) {
        reject(error as Error);
      }
    });
  },

  sendMessage(text: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(text);
    } else {
      throw new Error("WebSocket не подключен");
    }
  },

  onMessage(handler: (message: ChatMessage) => void) {
    this.messageHandlers.push(handler);
  },

  offMessage(handler: (message: ChatMessage) => void) {
    this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
  },

  onError(handler: (error: Error) => void) {
    this.errorHandlers.push(handler);
  },

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageHandlers = [];
    this.errorHandlers = [];
  },

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  },
};
