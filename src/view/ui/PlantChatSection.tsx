import React, { useState, useRef, useEffect } from "react";
import { Paper, TextInput, Button, Text, ScrollArea } from "@mantine/core";
import { ChatMessageRequest } from "@/models/dto/ChatMessageDto";
import { usePlantMessages } from "@/viewmodels/hooks/usePlantMessagesQuery";
import { useAddPlantMessage } from "@/viewmodels/hooks/usePlantMessageMutation";

interface PlantChatSectionProps {
    plantId: string;
}

export const PlantChatSection: React.FC<PlantChatSectionProps> = ({
    plantId,
}) => {
    const { data: messages = [] } = usePlantMessages(plantId);
    const addMessageMutation = useAddPlantMessage(plantId);
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
        const userMessage: ChatMessageRequest = {
            messageType: "user",
            content: newMessage,
        };

        addMessageMutation.mutate(userMessage);
        setNewMessage("");
    };

    return (
        <div className="flex flex-col h-full">
            <ScrollArea h={400} viewportRef={viewport}>
                <div className="p-4 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`max-w-3/4 ${
                                message.messageType === "user"
                                    ? "ml-auto bg-blue-500 text-white"
                                    : "mr-auto bg-gray-100"
                            } p-3 rounded-lg`}
                        >
                            <Text size="sm">{message.content}</Text>
                            <Text size="xs" c="dimmed" className="text-right">
                                {new Date(message.timestamp).toLocaleString()}
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
