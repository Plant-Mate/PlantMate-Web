import { useQuery } from "@tanstack/react-query";
import { getMessagesByPlant } from "@/services/chatService";
import type { ChatMessageResponse } from "@/models/dto/ChatMessageDto";

// 取得植物聊天訊息
export function usePlantMessages(plantId: string) {
    return useQuery<ChatMessageResponse[]>({
        queryKey: ["plantMessages", plantId],
        queryFn: () => getMessagesByPlant(plantId),
        enabled: !!plantId,
    });
}
