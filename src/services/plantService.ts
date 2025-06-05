import { PlantRequest, PlantResponse } from "@/models/dto/PlantDto";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function mapPlantResponse(data: unknown): PlantResponse {
    const d = data as Record<string, unknown>;
    return {
        id: d._id as string,
        name: d.name as string,
        species: d.species as string,
        description: (d.description as string) || "",
        sensorId: (d.sensor_id as string) || null,
        createdAt: d.created_at as string,
        updatedAt: d.updated_at as string,
    } as PlantResponse;
}

// 獲取所有植物
export const getAllPlants = async (): Promise<PlantResponse[]> => {
    const res = await fetch(`${BACKEND_URL}/api/plants`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch");
    console.log("Fetching all plants");

    const data = await res.json();
    return (data as unknown[]).map(mapPlantResponse);
};

// 獲取單一植物
export const getPlantById = async (
    id: string
): Promise<PlantResponse | null> => {
    const plants = await getAllPlants();
    console.log("Fetching plant by ID: ", id);
    return plants.find((plant) => plant.id === id) || null;
};

// 新增植物
export const addPlant = async (plant: PlantRequest): Promise<PlantResponse> => {
    const res = await fetch(`${BACKEND_URL}/api/plants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plant),
    });

    if (!res.ok) throw new Error("Failed to add plant");
    console.log("Adding new plant: ", plant);

    const data = await res.json();
    return mapPlantResponse(data);
};

// 更新植物資料
export const updatePlant = async (
    id: string,
    updatedData: Partial<PlantRequest>
): Promise<PlantResponse> => {
    const res = await fetch(`${BACKEND_URL}/api/plants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
    });

    if (!res.ok) throw new Error("Failed to update plant");
    console.log("Updating plant by ID: ", id, updatedData);

    const data = await res.json();
    return mapPlantResponse(data);
};

// 刪除植物
export const deletePlant = async (id: string): Promise<void> => {
    const res = await fetch(`${BACKEND_URL}/api/plants/${id}`, {
        method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete plant");
    console.log("Deleting plant by ID: ", id);
    return;
};

// 連結感測器
export const linkSensor = async (
    plantId: string,
    sensorId: string
): Promise<PlantResponse> => {
    const res = await fetch(`${BACKEND_URL}/api/plants/${plantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sensor_id: sensorId }),
    });

    if (!res.ok) throw new Error("Failed to link sensor");
    console.log("Linking sensor to plant: ", plantId, sensorId);

    const data = await res.json();
    return mapPlantResponse(data);
};
