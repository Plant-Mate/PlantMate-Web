export interface PlantRequest {
    name: string;
    species: string;
    description: string;
    sensorId?: string | null;
}

export interface PlantResponse {
    _id: string;
    name: string;
    species: string;
    description: string;
    sensorId: string | null;
    createdAt: string;
    updatedAt: string;
}
