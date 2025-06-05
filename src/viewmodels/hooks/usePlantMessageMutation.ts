import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPlant } from "@/services/chatService";
import type { ChatMessageRequest } from "@/models/dto/ChatMessageDto";

export function useAddPlantMessage(plantId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (message: ChatMessageRequest) => addPlant(plantId, message),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["plantMessages", plantId],
            });
        },
    });
}
