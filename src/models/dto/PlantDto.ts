export interface PlantRequest {
    name: string;
    species: string;
    description: string;
    sensorId?: string | null;
}

export interface PlantResponse {
    id: string;
    name: string;
    species: string;
    description: string;
    sensorId: string | null;
    createdAt: string;
    updatedAt: string;
}
