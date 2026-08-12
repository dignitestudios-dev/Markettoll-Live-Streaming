import { io, Socket } from "socket.io-client";
import jsCookie from "js-cookie";

export interface SocketAckResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

class LiveSocketService {
  private socket: Socket | null = null;
  private isConnecting = false;
  private currentToken: string | null = null;

  public connect(): Socket {
    const token =
      jsCookie.get("auth-token") ||
      (typeof window !== "undefined" ? localStorage.getItem("auth-token") : "") ||
      "";

    // If socket exists but auth token has changed, disconnect old socket
    if (this.socket && this.currentToken !== token) {
      console.log("🔄 Auth token changed. Reconnecting socket with new user token...");
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }

    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    if (this.isConnecting && this.socket) {
      return this.socket;
    }

    this.currentToken = token;
    this.isConnecting = true;

    const baseUrl =
      (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_BASE_URL) ||
      (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_BASE_URL) ||
      "https://dev.markettoll.com";

    // Extract origin URL for Socket.IO connection
    let socketUrl = baseUrl;
    try {
      const parsed = new URL(baseUrl);
      socketUrl = parsed.origin;
    } catch (err) {
      console.warn("Using fallback socket URL:", baseUrl);
    }

    this.socket = io(socketUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      forceNew: true,
    });

    this.socket.on("connect", () => {
      console.log("⚡ Live Socket Connected:", this.socket?.id);
      this.isConnecting = false;
    });

    this.socket.on("connect_error", (error) => {
      console.warn("⚠️ Live Socket Connection Error:", error.message);
      this.isConnecting = false;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("🔌 Live Socket Disconnected:", reason);
      this.isConnecting = false;
    });

    return this.socket;
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentToken = null;
      this.isConnecting = false;
    }
  }

  // Helper method for emitting with ACK promise
  public async emitWithAck<T = any>(event: string, payload: any): Promise<SocketAckResponse<T>> {
    const socket = this.connect();

    // If socket is establishing connection, wait up to 2.5s for connect event
    if (!socket.connected) {
      await new Promise<void>((resolve) => {
        let timer: NodeJS.Timeout;
        const onConnect = () => {
          clearTimeout(timer);
          socket.off("connect", onConnect);
          resolve();
        };
        socket.on("connect", onConnect);
        timer = setTimeout(() => {
          socket.off("connect", onConnect);
          resolve();
        }, 2500);
      });
    }

    if (!socket.connected) {
      console.warn(`Socket server offline/unreachable for event: ${event}`);
      return {
        success: false,
        message: "Socket server unavailable. Please check your connection.",
        error: "SOCKET_DISCONNECTED",
      };
    }

    return new Promise((resolve) => {
      const ackTimeout = setTimeout(() => {
        console.warn(`Socket ACK timeout for ${event}`);
        resolve({
          success: false,
          message: `Request timeout for ${event}. Please try again.`,
          error: "ACK_TIMEOUT",
        });
      }, 7000);

      socket.emit(event, payload, (response: SocketAckResponse<T>) => {
        clearTimeout(ackTimeout);
        if (response && response.success === false) {
          console.warn(`Socket error response on ${event}:`, response.error || response.message);
        }
        resolve(
          response || {
            success: false,
            message: `${event} failed to receive server response`,
            error: "NO_RESPONSE",
          }
        );
      });
    });
  }

  // 1. live:create
  public createLive(data: {
    title: string;
    description?: string;
    thumbnail?: string;
    category?: string;
    products?: string[];
    tags?: string[];
    visibility?: string;
  }) {
    return this.emitWithAck("live:create", {
      thumbnail:
        data.thumbnail || "",
      description: data.description || "Live shopping broadcast session",
      category: data.category || "General",
      products: data.products || [],
      ...data,
    });
  }

  // 2. live:join
  public joinLive(liveId: string) {
    return this.emitWithAck("live:join", { liveId });
  }

  // 3. live:leave
  public leaveLive(liveId: string) {
    return this.emitWithAck("live:leave", { liveId });
  }

  // 4. live:invite-cohost
  public inviteCohost(liveId: string, userId: string) {
    return this.emitWithAck("live:invite-cohost", { liveId, userId });
  }

  // 5. live:accept-cohost
  public acceptCohost(liveId: string, peerId?: string) {
    return this.emitWithAck("live:accept-cohost", { liveId, peerId });
  }

  // 6. live:reject-cohost
  public rejectCohost(liveId: string) {
    return this.emitWithAck("live:reject-cohost", { liveId });
  }

  // 7. live:kick-cohost
  public kickCohost(liveId: string, userId: string) {
    return this.emitWithAck("live:kick-cohost", { liveId, userId });
  }

  // 8. live:mute-cohost
  public muteCohost(liveId: string, userId: string, mute: boolean) {
    return this.emitWithAck("live:mute-cohost", { liveId, userId, mute });
  }

  // 9. live:self-mute
  public selfMute(liveId: string, mute: boolean) {
    return this.emitWithAck("live:self-mute", { liveId, mute });
  }

  // 10. live:message
  public sendMessage(liveId: string, message: string) {
    return this.emitWithAck("live:message", { liveId, message });
  }

  // 11. live:end
  public endLive(liveId: string) {
    return this.emitWithAck("live:end", { liveId });
  }

  // 12. live:get-participants
  public getParticipants(liveId: string) {
    return this.emitWithAck("live:get-participants", { liveId });
  }
}

export const liveSocketService = new LiveSocketService();
