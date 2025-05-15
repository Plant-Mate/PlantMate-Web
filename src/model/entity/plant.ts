export interface Plant {
    id: string;
    name: string;
    species: string;
    description: string;
    linkedSensor: string | null;
    createdAt: string;
    sensorData?: {
        soilMoisture: number;
        temperature: number;
        humidity: number;
        lastUpdated: string;
    };
}
