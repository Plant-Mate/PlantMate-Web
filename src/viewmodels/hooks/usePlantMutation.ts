import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    addPlant,
    deletePlant,
    updatePlant,
    linkSensor,
} from "@/services/plantService";
import { PlantRequest, PlantResponse } from "@/models/dto/PlantDto";

export const usePlantMutations = () => {
    const queryClient = useQueryClient();

    // 新增植物
    const add = useMutation<PlantResponse, Error, PlantRequest>({
        mutationFn: addPlant,
        onSuccess: (newPlant) => {
            queryClient.setQueryData<PlantResponse[]>(["plants"], (old) =>
                old ? [...old, newPlant] : [newPlant]
            );
        },
    });

    // 更新植物
    const update = useMutation<
        PlantResponse,
        Error,
        { id: string; data: Partial<PlantRequest> }
    >({
        mutationFn: ({ id, data }) => updatePlant(id, data),
        onSuccess: (updatedPlant) => {
            queryClient.setQueryData<PlantResponse[]>(["plants"], (old) =>
                old
                    ? old.map((p) =>
                          p.id === updatedPlant.id ? updatedPlant : p
                      )
                    : []
            );
        },
    });

    // 刪除植物
    const remove = useMutation<void, Error, string>({
        mutationFn: deletePlant,
        onSuccess: (_data, deletedId) => {
            queryClient.setQueryData<PlantResponse[]>(["plants"], (old) =>
                old ? old.filter((p) => p.id !== deletedId) : []
            );
        },
    });

    // 連結感測器
    const link = useMutation<
        PlantResponse,
        Error,
        { plantId: string; sensorId: string }
    >({
        mutationFn: ({ plantId, sensorId }) => linkSensor(plantId, sensorId),
        onSuccess: (updatedPlant) => {
            queryClient.setQueryData<PlantResponse[]>(["plants"], (old) =>
                old
                    ? old.map((p) =>
                          p.id === updatedPlant.id ? updatedPlant : p
                      )
                    : []
            );
        },
    });

    return {
        // Add
        addPlant: add.mutate,
        addPlantAsync: add.mutateAsync,
        isAdding: add.isPending,

        // Update
        updatePlant: update.mutate,
        updatePlantAsync: update.mutateAsync,
        isUpdating: update.isPending,

        // Delete
        deletePlant: remove.mutate,
        deletePlantAsync: remove.mutateAsync,
        isDeleting: remove.isPending,

        // Link Sensor
        linkSensor: link.mutate,
        linkSensorAsync: link.mutateAsync,
        isLinkingSensor: link.isPending,
    };
};
