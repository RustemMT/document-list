"use client";

import { useEffect, useState, useRef } from "react";
import { Input, Button, message, Spin } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { ChatMessage } from "@/types/chat";
import { chatService } from "@/services/chatService";
import styles from "./page.module.css";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    connectToChat();

    return () => {
      chatService.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectToChat = async () => {
    setLoading(true);
    try {
      await chatService.connect();
      setConnected(true);

      chatService.onMessage((message) => {
        setMessages((prev) => [...prev, message]);
      });

      chatService.onError((error) => {
        message.error(error.message);
        setConnected(false);
      });
    } catch (error) {
      message.error("Ошибка подключения к чату");
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    if (!connected) {
      message.warning("Чат не подключен");
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      chatService.sendMessage(inputValue);
      setInputValue("");
    } catch (error) {
      message.error("Ошибка при отправке сообщения");
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Чат</h1>

      <div className={styles.messagesContainer}>
        {loading && !connected ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" />
            <p className={styles.loadingText}>Подключение к чату...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className={styles.emptyContainer}>
            Нет сообщений. Начните общение!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.messageWrapper} ${
                msg.sender === "user"
                  ? styles.messageWrapperUser
                  : styles.messageWrapperAssistant
              }`}
            >
              <div
                className={`${styles.messageBubble} ${
                  msg.sender === "user"
                    ? styles.messageBubbleUser
                    : styles.messageBubbleAssistant
                }`}
              >
                <div className={styles.messageText}>{msg.text}</div>
                <div
                  className={`${styles.messageTime} ${
                    msg.sender === "user"
                      ? styles.messageTimeUser
                      : styles.messageTimeAssistant
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={handleSend}
          placeholder="Введите сообщение..."
          disabled={!connected}
          size="large"
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={!connected || !inputValue.trim()}
          size="large"
        >
          Отправить
        </Button>
      </div>

      {connected && <div className={styles.statusIndicator}>Подключено</div>}
    </div>
  );
}
