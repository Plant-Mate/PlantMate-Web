import { PlantRequest, PlantResponse } from "../dto/PlantDto";
const SENSOR_KEY = "plantmate_sensors";

// 獲取所有植物
export const getAllPlants = async (): Promise<PlantResponse[]> => {
    const res = await fetch("/api/plants", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch");

    const data: PlantResponse[] = await res.json();
    return data;
};

// 獲取單一植物
export const getPlantById = async (
    id: string
): Promise<PlantResponse | null> => {
    const plants = await getAllPlants();
    return plants.find((plant) => plant.id === id) || null;
};

// 新增植物
export const addPlant = async (plant: PlantRequest): Promise<PlantResponse> => {
    const res = await fetch("/api/plants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plant),
    });

    if (!res.ok) throw new Error("Failed to add plant");

    const data: PlantResponse = await res.json();
    return data;
};

// 更新植物資料
export const updatePlant = async (
    id: string,
    updatedData: Partial<PlantRequest>
): Promise<PlantResponse> => {
    const res = await fetch(`/api/plants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
    });

    if (!res.ok) throw new Error("Failed to update plant");

    const data: PlantResponse = await res.json();
    return data;
};

// 刪除植物
export const deletePlant = async (id: string): Promise<void> => {
    const res = await fetch(`/api/plants/${id}`, {
        method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete plant");
    return;
};

// 連結感測器
export const linkSensor = async (
    plantId: string,
    sensorId: string
): Promise<PlantResponse> => {
    const res = await fetch(`/api/plants/${plantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sensor_id: sensorId }),
    });

    if (!res.ok) throw new Error("Failed to link sensor");

    const data: PlantResponse = await res.json();
    return data;
};

// 生成模擬感測器數據
export const generateMockSensorData = async (
    plantId: string
): Promise<void> => {
    const plant = await getPlantById(plantId);
    if (!plant || !plant.sensorId) return;

    const sensorKey = `${SENSOR_KEY}_${plant.sensorId}`;
    const prevData = localStorage.getItem(sensorKey);
    const dataList = prevData ? JSON.parse(prevData) : [];

    const newSensorData = {
        soilMoisture: Math.floor(Math.random() * 100),
        temperature: Math.floor(Math.random() * 15) + 20, // 20-35℃
        humidity: Math.floor(Math.random() * 50) + 30, // 30-80%
        lastUpdated: new Date().toISOString(),
    };

    dataList.push(newSensorData);
    localStorage.setItem(sensorKey, JSON.stringify(dataList));
};
