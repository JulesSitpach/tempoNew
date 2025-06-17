class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectTimer: number | null = null;
  private url: string;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();
  private connected = false;

  constructor() {
    // Get WebSocket URL from environment or use default
    this.url = import.meta.env.VITE_WS_URL || "ws://localhost:3000";
  }

  connect() {
    if (this.socket) {
      return;
    }

    try {
      console.log(`Connecting to WebSocket at ${this.url}`);
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log("WebSocket connection established");
        this.connected = true;

        // Clear any reconnect timers
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }

        // Notify listeners of connection
        this.notifyListeners("connect", { status: "connected" });
      };

      this.socket.onclose = () => {
        console.warn("WebSocket connection closed");
        this.connected = false;
        this.socket = null;

        // Notify listeners of disconnection
        this.notifyListeners("disconnect", { status: "disconnected" });

        // Try to reconnect after 5 seconds
        this.reconnectTimer = window.setTimeout(() => {
          this.connect();
        }, 5000);
      };

      this.socket.onerror = error => {
        console.error("WebSocket error:", error);
        this.notifyListeners("error", { error });
      };

      this.socket.onmessage = event => {
        try {
          const data = JSON.parse(event.data);
          this.notifyListeners("message", data);

          // Also notify type-specific listeners if type is present
          if (data.type) {
            this.notifyListeners(data.type, data);
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error);

      // Try to reconnect after 5 seconds
      this.reconnectTimer = window.setTimeout(() => {
        this.connect();
      }, 5000);
    }
  }

  send(data: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
      return true;
    } else {
      console.warn("WebSocket not connected, unable to send data");
      return false;
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);

    return () => this.off(event, callback);
  }

  off(event: string, callback: (data: any) => void) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private notifyListeners(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket "${event}" listener:`, error);
        }
      });
    }
  }

  isConnected() {
    return this.connected;
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.connected = false;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}

// Create a singleton instance
const websocketService = new WebSocketService();

// Auto-connect when imported in development mode
if (import.meta.env.DEV) {
  websocketService.connect();
}

export default websocketService;
