import { useState, useEffect, useCallback } from "react";
import { Plant } from "../model/entity/plant";
import { plantService } from "../model/service/plantService";

export const usePlants = () => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 載入所有植物資料
    const loadPlants = useCallback(() => {
        try {
            const plantsData = plantService.getAllPlants();
            setPlants(plantsData);
            setError(null);
        } catch (err) {
            console.error("Error loading plants:", err);
            setError("載入植物資料失敗");
        } finally {
            setLoading(false);
        }
    }, []);

    // 新增植物
    const addPlant = useCallback((plant: Omit<Plant, "id" | "createdAt">) => {
        try {
            const newPlant = plantService.addPlant(plant);
            setPlants((prev) => [...prev, newPlant]);
            return newPlant;
        } catch (err) {
            console.error("Error adding plant:", err);
            setError("新增植物失敗");
            return null;
        }
    }, []);

    // 更新植物
    const updatePlant = useCallback(
        (id: string, updatedData: Partial<Plant>) => {
            try {
                const updatedPlant = plantService.updatePlant(id, updatedData);
                if (updatedPlant) {
                    setPlants((prev) =>
                        prev.map((plant) =>
                            plant.id === id ? updatedPlant : plant
                        )
                    );
                }
                return updatedPlant;
            } catch (err) {
                console.error("Error updating plant:", err);
                setError("更新植物資料失敗");
                return null;
            }
        },
        []
    );

    // 刪除植物
    const deletePlant = useCallback((id: string) => {
        try {
            const success = plantService.deletePlant(id);
            if (success) {
                setPlants((prev) => prev.filter((plant) => plant.id !== id));
            }
            return success;
        } catch (err) {
            console.error("Error deleting plant:", err);
            setError("刪除植物失敗");
            return false;
        }
    }, []);

    // 連結感測器
    const linkSensor = useCallback((plantId: string, sensorId: string) => {
        try {
            const updatedPlant = plantService.linkSensor(plantId, sensorId);
            if (updatedPlant) {
                setPlants((prev) =>
                    prev.map((plant) =>
                        plant.id === plantId ? updatedPlant : plant
                    )
                );
            }
            return updatedPlant;
        } catch (err) {
            console.error("Error linking sensor:", err);
            setError("連結感測器失敗");
            return null;
        }
    }, []);

    // 獲取單一植物資料
    const getPlantById = useCallback(
        (id: string) => {
            return plants.find((plant) => plant.id === id) || null;
        },
        [plants]
    );

    // 初始化：載入所有植物資料
    useEffect(() => {
        loadPlants();
    }, [loadPlants]);

    return {
        plants,
        loading,
        error,
        addPlant,
        updatePlant,
        deletePlant,
        linkSensor,
        getPlantById,
        refreshPlants: loadPlants,
    };
};
