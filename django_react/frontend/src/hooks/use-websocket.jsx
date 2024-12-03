import React, { createContext, useState, useContext } from 'react';

const WebSocketContext = createContext(null);

function WebSocketProvider({ children }) {
  const webSocket = useWebSocket();

  return (
    <WebSocketContext.Provider value={webSocket}>
      {children}
    </WebSocketContext.Provider>
  );
}

const useWebSocket = () => {
  const [webSocket, setWebSocket] = useState(null);

  const connectWebSocket = (id, onMessage, setLoadingNext = () => { }) => {
    // 建立 WebSocket 連接
    const ws = new WebSocket(`${window?.location?.protocol == 'https:' ? 'wss' : 'ws'}://${import.meta.env.VITE_FE_HOST.replace(/^https?:\/\//, '')}/ws/report/${id}/`);
    setWebSocket(ws);

    // 當 WebSocket 連接開啟時觸發
    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    // 當收到 WebSocket 訊息時觸發
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('message===>', message);

      onMessage(message, ws)
    };

    // 當 WebSocket 發生錯誤時觸發
    ws.onerror = (error) => {
      setLoadingNext(false);
      console.error('WebSocket error:', error);
    };

    // 當 WebSocket 連接關閉時觸發
    ws.onclose = (event) => {
      console.log('WebSocket connection closed');
      console.log('Code:', event.code, 'Reason:', event.reason);
    };
  };

  const disconnectWebSocket = (ws = webSocket) => {
    if (ws) {
      console.log('Closing WebSocket connection');
      ws.close();
      setWebSocket(null);
    }
  };

  return {
    webSocket,
    connectWebSocket,
    disconnectWebSocket,
  }
};

const useWebSocketContext = () => {
  return useContext(WebSocketContext);
};

export { WebSocketProvider, useWebSocketContext };
export default useWebSocket;