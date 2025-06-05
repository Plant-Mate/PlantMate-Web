export interface ChatMessageRequest {
    messageType: "user";
    content: string;
}

export interface ChatMessageResponse {
    id: string;
    plantId: string;
    messageType: "user" | "assistant";
    content: string;
    timestamp: string; // ISO 8601 格式的時間戳
}
