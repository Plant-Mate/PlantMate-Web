import { Plant } from "../entity/plant";
import { v4 as uuidv4 } from "uuid";
const PLANTS_KEY = "plantmate_plants";

export const plantService = {
    // 獲取所有植物
    getAllPlants: (): Plant[] => {
        if (typeof window === "undefined") return [];
        const plants = localStorage.getItem(PLANTS_KEY);
        return plants ? JSON.parse(plants) : [];
    },

    // 獲取單一植物
    getPlantById: (id: string): Plant | null => {
        const plants = plantService.getAllPlants();
        return plants.find((plant) => plant.id === id) || null;
    },

    // 新增植物
    addPlant: (plant: Omit<Plant, "id" | "createdAt">): Plant => {
        const plants = plantService.getAllPlants();
        const newPlant: Plant = {
            ...plant,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            linkedSensor: null,
        };

        localStorage.setItem(PLANTS_KEY, JSON.stringify([...plants, newPlant]));
        return newPlant;
    },

    // 更新植物資料
    updatePlant: (id: string, updatedData: Partial<Plant>): Plant | null => {
        const plants = plantService.getAllPlants();
        const plantIndex = plants.findIndex((plant) => plant.id === id);

        if (plantIndex === -1) return null;

        const updatedPlant = {
            ...plants[plantIndex],
            ...updatedData,
        };

        plants[plantIndex] = updatedPlant;
        localStorage.setItem(PLANTS_KEY, JSON.stringify(plants));

        return updatedPlant;
    },

    // 刪除植物
    deletePlant: (id: string): boolean => {
        const plants = plantService.getAllPlants();
        const filteredPlants = plants.filter((plant) => plant.id !== id);

        if (filteredPlants.length === plants.length) return false;

        localStorage.setItem(PLANTS_KEY, JSON.stringify(filteredPlants));
        return true;
    },

    // 連結感測器
    linkSensor: (plantId: string, sensorId: string): Plant | null => {
        return plantService.updatePlant(plantId, {
            linkedSensor: sensorId,
            sensorData: {
                soilMoisture: Math.floor(Math.random() * 100),
                temperature: Math.floor(Math.random() * 15) + 20, // 20-35℃
                humidity: Math.floor(Math.random() * 50) + 30, // 30-80%
                lastUpdated: new Date().toISOString(),
            },
        });
    },

    // 生成模擬感測器數據
    generateMockSensorData: (plantId: string): Plant | null => {
        const plant = plantService.getPlantById(plantId);
        if (!plant || !plant.linkedSensor) return null;

        return plantService.updatePlant(plantId, {
            sensorData: {
                soilMoisture: Math.floor(Math.random() * 100),
                temperature: Math.floor(Math.random() * 15) + 20, // 20-35℃
                humidity: Math.floor(Math.random() * 50) + 30, // 30-80%
                lastUpdated: new Date().toISOString(),
            },
        });
    },
};
