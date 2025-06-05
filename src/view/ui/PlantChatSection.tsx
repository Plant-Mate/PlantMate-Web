import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    Paper,
    TextInput,
    Button,
    Text,
    ScrollArea,
    Loader,
} from "@mantine/core";
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
    const [isAiTyping, setIsAiTyping] = useState(false);
    const [aiThinking, setAiThinking] = useState(false);
    const [typingText, setTypingText] = useState("");
    const [lastProcessedMessageId, setLastProcessedMessageId] = useState<
        string | null
    >(null);
    const viewport = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (viewport.current) {
            viewport.current.scrollTo({
                top: viewport.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages, aiThinking, typingText]);

    const startAiResponseFlow = useCallback(async (responseText: string) => {
        // Show thinking state with random duration (3-8 seconds)
        setAiThinking(true);
        const thinkingDuration = Math.floor(Math.random() * 5000) + 3000; // 3000ms + 0-5000ms = 3-8 seconds

        await new Promise((resolve) => setTimeout(resolve, thinkingDuration));

        // Start typing animation
        animateAiResponse(responseText);
    }, []);
    // Monitor for new AI messages and animate them
    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];

            // Check if it's a new AI message that we haven't processed yet
            if (
                lastMessage.messageType === "assistant" &&
                lastMessage.id !== lastProcessedMessageId &&
                !isAiTyping &&
                !aiThinking
            ) {
                setLastProcessedMessageId(lastMessage.id);
                startAiResponseFlow(lastMessage.content);
            }
        }
    }, [
        messages,
        lastProcessedMessageId,
        isAiTyping,
        aiThinking,
        startAiResponseFlow,
    ]);

    const animateAiResponse = async (responseText: string) => {
        setAiThinking(false);
        setIsAiTyping(true);
        setTypingText("");

        // Type out the response character by character
        let currentText = "";
        for (let i = 0; i < responseText.length; i++) {
            currentText += responseText[i];
            setTypingText(currentText);
            await new Promise((resolve) => setTimeout(resolve, 50));
        }

        // Wait a moment then finish
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsAiTyping(false);
        setTypingText("");
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || isAiTyping || aiThinking) return;

        const userMessage: ChatMessageRequest = {
            messageType: "user",
            content: newMessage,
        };

        setNewMessage("");

        // Add user message - the AI response will come automatically from the API
        addMessageMutation.mutate(userMessage);
    };

    const isDisabled = isAiTyping || aiThinking;

    // Filter out the last AI message if we're currently animating it or thinking about it
    const displayMessages =
        isAiTyping || aiThinking
            ? messages.filter((_, index) => {
                  if (index === messages.length - 1) {
                      const lastMessage = messages[messages.length - 1];
                      return (
                          lastMessage.messageType !== "assistant" ||
                          lastMessage.id !== lastProcessedMessageId
                      );
                  }
                  return true;
              })
            : messages;

    return (
        <div
            className="flex flex-col"
            style={{ height: "calc(100vh - 250px)" }}
        >
            <ScrollArea style={{ flex: 1 }} viewportRef={viewport}>
                <div className="p-4 space-y-4">
                    {displayMessages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${
                                message.messageType === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`inline-block max-w-xs sm:max-w-sm md:max-w-lg ${
                                    message.messageType === "user"
                                        ? "bg-blue-400 text-white"
                                        : "bg-gray-100"
                                } p-3 rounded-lg`}
                            >
                                <Text size="sm">{message.content}</Text>
                                <Text size="xs" className="text-right mt-1">
                                    {new Date(
                                        message.timestamp
                                    ).toLocaleString()}
                                </Text>
                            </div>
                        </div>
                    ))}

                    {/* AI Thinking Indicator */}
                    {aiThinking && (
                        <div className="flex justify-start">
                            <div className="inline-block bg-gray-100 p-3 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Loader size="sm" />
                                    <Text size="sm" c="dimmed">
                                        AI 正在思考...
                                    </Text>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* AI Typing Indicator */}
                    {isAiTyping && typingText && (
                        <div className="flex justify-start">
                            <div className="inline-block max-w-xs sm:max-w-sm md:max-w-lg bg-gray-100 p-3 rounded-lg">
                                <Text size="sm">
                                    {typingText}
                                    <span className="animate-pulse">|</span>
                                </Text>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <Paper className="p-2 border-t mt-auto" withBorder>
                <div className="flex gap-2">
                    <TextInput
                        placeholder={
                            isDisabled ? "AI 回應中..." : "輸入訊息..."
                        }
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (
                                e.key === "Enter" &&
                                !e.shiftKey &&
                                !isDisabled
                            ) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        className="flex-grow"
                        disabled={isDisabled}
                    />
                    <Button
                        onClick={handleSendMessage}
                        disabled={isDisabled}
                        loading={isDisabled}
                    >
                        發送
                    </Button>
                </div>
            </Paper>
        </div>
    );
};
