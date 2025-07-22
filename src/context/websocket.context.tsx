import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuthStore } from 'stores/auth.store';
import type { INotification } from 'types/notification.type';

type NotificationCallback = (notification: INotification) => void;

interface IWebSocketContext {
    stompClient: Client | null;
    isConnected: boolean;
    subscribeToNotifications: (callback: NotificationCallback) => (() => void) | undefined;
}

const WebSocketContext = createContext<IWebSocketContext | null>(null);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const { accessToken, user } = useAuthStore();
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // LOG 1: Kiểm tra xem có access token không
        console.log('[WebSocketProvider] useEffect triggered. AccessToken exists:', !!accessToken);

        if (accessToken) {
            const client = new Client({
                webSocketFactory: () => new SockJS(`${import.meta.env.VITE_BACKEND_URL}/ws`),
                connectHeaders: {
                    Authorization: `Bearer ${accessToken}`,
                },
                debug: (str) => {
                    // LOG 2: Log chi tiết từ thư viện STOMP
                    console.log('[STOMP Debug]', str);
                },
                reconnectDelay: 5000,
            });

            client.onConnect = (frame) => {
                // LOG 4: Kết nối thành công!
                console.log('%c[WebSocketProvider] WebSocket Connected!', 'color: green; font-weight: bold;', frame);
                setIsConnected(true);
            };

            client.onStompError = (frame) => {
                // LOG 5: Lỗi từ STOMP Broker (thường là lỗi xác thực)
                console.error('%c[WebSocketProvider] STOMP Broker Error', 'color: red; font-weight: bold;', frame.headers['message'], frame.body);
            };

            client.onWebSocketError = (event) => {
                // LOG 6: Lỗi ở tầng WebSocket (không thể kết nối tới server)
                console.error('%c[WebSocketProvider] WebSocket Connection Error', 'color: red; font-weight: bold;', event);
            };

            setStompClient(client);

            // LOG 3: Bắt đầu kích hoạt kết nối
            console.log('[WebSocketProvider] Activating STOMP client...');
            client.activate();

            return () => {
                // LOG 7: Dọn dẹp và ngắt kết nối
                console.log('[WebSocketProvider] Deactivating STOMP client.');
                client.deactivate();
                setIsConnected(false);
            };
        }
    }, [accessToken]);

    const subscribeToNotifications = (callback: NotificationCallback) => {
        if (isConnected && stompClient) {
            const subscription = stompClient.subscribe(`/topic/notifications.${user?.id}`, (message) => {
                const newNotification: INotification = JSON.parse(message.body);
                callback(newNotification);
            });
            return () => subscription.unsubscribe();
        }
        return undefined;
    };

    const contextValue = {
        stompClient,
        isConnected,
        subscribeToNotifications,
    };

    return (
        <WebSocketContext.Provider value={contextValue}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};
