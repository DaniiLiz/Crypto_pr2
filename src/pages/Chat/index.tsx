import { useCallback, useEffect, useState } from "react";
import { Button, Input } from "antd";
import styles from "./Chat.module.css";

type MessageType = {
  text: string;
  username?: string;
  timestamp: string; // Делаем обязательным
};

export default function Chat() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputText, setInputText] = useState("");
  const [username, setUsername] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "error">("disconnected");

  useEffect(() => {
    const wsUrl = "wss://your-websocket-server.com"; // Замените на ваш URL
    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => {
      setSocket(newSocket);
      setConnectionStatus("connected");
      addSystemMessage("Connected to server");
    };

    newSocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as MessageType;
        // Добавляем timestamp, если его нет
        if (!message.timestamp) {
          message.timestamp = new Date().toISOString();
        }
        setMessages(prev => [...prev, message]);
      } catch (error) {
        console.error("Error parsing message:", error);
        addSystemMessage("Message format error");
      }
    };

    newSocket.onclose = () => {
      setSocket(null);
      setConnectionStatus("disconnected");
      addSystemMessage("Connection closed");
    };

    newSocket.onerror = () => {
      setConnectionStatus("error");
      addSystemMessage("Connection error");
    };

    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }, []);

  const addSystemMessage = (text: string) => {
    setMessages(prev => [...prev, {
      text,
      timestamp: new Date().toISOString()
    }]);
  };

  const sendMessage = useCallback(() => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !inputText.trim()) return;

    if (inputText.startsWith("/name ")) {
      const newUsername = inputText.split(" ")[1];
      if (newUsername) {
        setUsername(newUsername);
        addSystemMessage(`Username set to: ${newUsername}`);
      }
    } else {
      if (!username) {
        addSystemMessage("Set username first with /name YourName");
        return;
      }
      const message: MessageType = {
        text: inputText,
        username,
        timestamp: new Date().toISOString()
      };
      socket.send(JSON.stringify(message));
    }
    setInputText("");
  }, [socket, inputText, username]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
      <div className={styles.chatContainer}>
        <div className={styles.messages}>
          {messages.map((msg, index) => (
              <div key={index} className={msg.username ? styles.message : styles.systemMessage}>
                {msg.username && <strong>{msg.username}: </strong>}
                <span>{msg.text}</span>
                <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
              </div>
          ))}
        </div>

        <div className={styles.form}>
          <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onPressEnter={handleKeyPress}
              placeholder={username ? "Type a message..." : "Set username with /name YourName"}
              disabled={connectionStatus !== "connected"}
          />
          <Button
              type="primary"
              onClick={sendMessage}
              disabled={connectionStatus !== "connected" || !inputText.trim()}
          >
            Send
          </Button>
        </div>

        <div className={styles.connectionStatus}>
          Status: <span className={connectionStatus === "connected" ? styles.connected : styles.disconnected}>
          {connectionStatus.toUpperCase()}
        </span>
        </div>
      </div>
  );
}