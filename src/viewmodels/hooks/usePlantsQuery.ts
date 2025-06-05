import { useQuery } from "@tanstack/react-query";
import { getAllPlants } from "@/services/plantService";
import { PlantResponse } from "@/models/dto/PlantDto";

export const usePlantsQuery = () => {
    return useQuery<PlantResponse[], Error>({
        queryKey: ["plants"],
        queryFn: getAllPlants,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
