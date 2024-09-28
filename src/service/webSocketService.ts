export default class WebSocketService {
    public socket: WebSocket | null;
    private url: string;
  
    constructor(url: string) {
      this.url = url;
      this.socket = null;
    }
  
    connect(): void {
      this.socket = new WebSocket(this.url);
  
      this.socket.onopen = () => {
        console.log('WebSocket connected successfully');
      };
  
      this.socket.onmessage = (event: MessageEvent) => {
        console.log('Message from server: ', event.data);
      };
  
      this.socket.onclose = (e) => {
        console.log('WebSocket connection closed', e);
      };
  
      this.socket.onerror = (error: Event) => {
        console.error('WebSocket error: ', error);
      };
    }
    
    sendMessage(message: any): void {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        // this.socket.
        this.socket.send(JSON.stringify(message));
      } else {
        console.warn('WebSocket is not connected');
      }
    }
  
    close(): void {
      if (this.socket) {
        this.socket.close();
      }
    }
  }
  