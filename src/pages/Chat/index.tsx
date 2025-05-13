import { useCallback, useEffect, useState } from "react";
import { Button, Flex, Input, Tag, Typography } from "antd";
import styles from "./Chat.module.css";

const { Text, Paragraph } = Typography;

type MessageType = {
  text: string;
  username?: string;
  timestamp?: string;
};

export default function Chat() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputText, setInputText] = useState("");
  const [username, setUsername] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "error">("disconnected");

  useEffect(() => {
    const newSocket = new WebSocket("ws://89.169.168.253:4500");

    newSocket.onopen = () => {
      console.log("WebSocket connected");
      setSocket(newSocket);
      setConnectionStatus("connected");
      addSystemMessage("Подключено к серверу");
    };

    newSocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setMessages(prev => [...prev, message]);
      } catch (error) {
        console.error("Error parsing message:", error);
        addSystemMessage("Ошибка формата сообщения");
      }
    };

    newSocket.onclose = () => {
      console.log("WebSocket disconnected");
      setSocket(null);
      setConnectionStatus("disconnected");
      addSystemMessage("Соединение закрыто");
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus("error");
      addSystemMessage("Ошибка подключения");
    };

    return () => {
      newSocket.close();
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
        socket.send(JSON.stringify({
          type: "set_username",
          username: newUsername
        }));
        addSystemMessage(`Установлено имя: ${newUsername}`);
      }
    } else {
      if (!username) {
        addSystemMessage("Ошибка: Сначала установите имя с помощью /name ВашеИмя");
        return;
      }
      const message = {
        type: "message",
        text: inputText,
        username,
        timestamp: new Date().toISOString()
      };
      socket.send(JSON.stringify(message));
    }
    setInputText("");
  }, [socket, inputText, username]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
      <div className={styles.chatContainer}>
        <div className={styles.messageContainer}>
          {messages.map((msg, index) => (
              <div
                  key={index}
                  className={msg.username ? styles.message : styles.systemMessage}
              >
                {msg.username ? (
                    <>
                      <Text strong style={{ color: "#ff9e00" }}>{msg.username}: </Text>
                      <Text style={{ color: "#ffffff" }}>{msg.text}</Text>
                      <Text type="secondary" className={styles.timestamp}>
                        {msg.timestamp && new Date(msg.timestamp).toLocaleTimeString()}
                      </Text>
                    </>
                ) : (
                    <Text style={{ color: "#2bff00" }}>{"> "}{msg.text}</Text>
                )}
              </div>
          ))}
        </div>

        <form className={styles.form}>
          <Flex gap={10} align="center">
            <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  username
                      ? "Введите сообщение..."
                      : "Установите имя: /name ВашеИмя"
                }
                disabled={connectionStatus !== "connected"}
                className={styles.chatInput}
            />
            <Button
                type="primary"
                onClick={sendMessage}
                disabled={connectionStatus !== "connected" || !inputText.trim()}
                className={styles.sendButton}
            >
              Отправить
            </Button>
          </Flex>

          <Paragraph className={styles.status}>
            Статус:{" "}
            {connectionStatus === "connected" ? (
                <Tag color="#2bff00" style={{ color: "#000" }}>ONLINE</Tag>
            ) : connectionStatus === "error" ? (
                <Tag color="#ff2d75" style={{ color: "#000" }}>ERROR</Tag>
            ) : (
                <Tag color="#ff9e00" style={{ color: "#000" }}>OFFLINE</Tag>
            )}
          </Paragraph>
        </form>
      </div>
  );
}