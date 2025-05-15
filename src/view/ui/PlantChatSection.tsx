import React, { useState, useRef, useEffect } from "react";
import { Paper, TextInput, Button, Text, ScrollArea } from "@mantine/core";

interface Message {
    id: string;
    text: string;
    sender: "user" | "plant";
    timestamp: Date;
}

interface PlantChatSectionProps {
    plantName: string;
}

export const PlantChatSection: React.FC<PlantChatSectionProps> = ({
    plantName,
}) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: `你好！我是${plantName}，今天感覺如何？`,
            sender: "plant",
            timestamp: new Date(),
        },
    ]);
    const [newMessage, setNewMessage] = useState("");
    const viewport = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (viewport.current) {
            viewport.current.scrollTo({
                top: viewport.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        // 新增使用者訊息
        const userMessage: Message = {
            id: Date.now().toString(),
            text: newMessage,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setNewMessage("");

        // 模擬植物回覆
        setTimeout(() => {
            const plantResponses = [
                `我覺得今天的陽光很充足！`,
                `我想我需要一些水...`,
                `謝謝你照顧我！`,
                `今天的溫度剛剛好！`,
                `我的葉子感覺有點乾燥，可以幫我噴點水嗎？`,
                `我感覺非常健康！`,
            ];

            const randomResponse =
                plantResponses[
                    Math.floor(Math.random() * plantResponses.length)
                ];

            const plantMessage: Message = {
                id: Date.now().toString(),
                text: randomResponse,
                sender: "plant",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, plantMessage]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-full">
            <ScrollArea h={400} viewportRef={viewport}>
                <div className="p-4 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`max-w-3/4 ${
                                message.sender === "user"
                                    ? "ml-auto bg-blue-500 text-white"
                                    : "mr-auto bg-gray-100"
                            } p-3 rounded-lg`}
                        >
                            <Text size="sm">{message.text}</Text>
                            <Text size="xs" c="dimmed" className="text-right">
                                {message.timestamp.toLocaleTimeString()}
                            </Text>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <Paper className="p-2 border-t mt-auto" withBorder>
                <div className="flex gap-2">
                    <TextInput
                        placeholder="輸入訊息..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        className="flex-grow"
                    />
                    <Button onClick={handleSendMessage}>發送</Button>
                </div>
            </Paper>
        </div>
    );
};
