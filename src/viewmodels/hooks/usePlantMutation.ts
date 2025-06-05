import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPlant, deletePlant, updatePlant } from "@/services/plantService";
import { PlantRequest } from "@/models/dto/PlantDto";

export const usePlantMutations = () => {
    const queryClient = useQueryClient();

    // 新增植物
    const add = useMutation({
        mutationFn: addPlant,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["plants"] });
        },
    });

    // 更新植物
    const update = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: Partial<PlantRequest>;
        }) => updatePlant(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["plants"] });
        },
    });

    // 刪除植物
    const remove = useMutation({
        mutationFn: (id: string) => deletePlant(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["plants"] });
        },
    });

    return {
        addPlant: add.mutate,
        addPlantAsync: add.mutateAsync,
        isAdding: add.isPending,

        updatePlant: update.mutate,
        updatePlantAsync: update.mutateAsync,
        isUpdating: update.isPending,

        deletePlant: remove.mutate,
        deletePlantAsync: remove.mutateAsync,
        isDeleting: remove.isPending,
    };
};
