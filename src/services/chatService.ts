import {
    ChatMessageRequest,
    ChatMessageResponse,
} from "@/models/dto/ChatMessageDto";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function mapMessageResponse(data: unknown): ChatMessageResponse {
    const d = data as Record<string, unknown>;
    return {
        id: d._id as string,
        plantId: d.plant_id as string,
        messageType: d.message_type as string,
        content: d.content as string,
        timestamp: d.timestamp as string,
    } as ChatMessageResponse;
}

// 獲取植物聊天訊息
export const getMessagesByPlant = async (
    plantId: string
): Promise<ChatMessageResponse[]> => {
    const res = await fetch(
        `${BACKEND_URL}/api/chat-messages/by-plant/${plantId}`,
        {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }
    );

    if (!res.ok) throw new Error("Failed to fetch");
    console.log("Fetching messages for plant: ", plantId);

    const data = await res.json();
    return (data as unknown[]).map(mapMessageResponse);
};

// 新增聊天訊息
export const addPlant = async (
    plantId: string,
    message: ChatMessageRequest
): Promise<ChatMessageResponse> => {
    const res = await fetch(`${BACKEND_URL}/api/chat-messages/${plantId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            message_type: message.messageType,
            content: message.content,
        }),
    });

    if (!res.ok) throw new Error("Failed to add plant");
    console.log("Adding message for plant: ", plantId);

    const data = await res.json();
    return mapMessageResponse(data);
};
