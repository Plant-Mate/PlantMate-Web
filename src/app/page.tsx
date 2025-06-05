"use client";

import { useState } from "react";
import { AppShell, Container, Text, Button, SimpleGrid } from "@mantine/core";
import { AppHeader } from "../view/ui/AppHeader";
import { PlantCard } from "../view/ui/PlantCard";
import { AddPlantModal } from "../view/ui/AddPlantModal";
import { usePlantsQuery } from "@/viewmodels/hooks/usePlantsQuery";
import { usePlantMutations } from "@/viewmodels/hooks/usePlantMutation";

export default function Home() {
    const [addModalOpen, setAddModalOpen] = useState(false);
    const { data: plants, isLoading: loading } = usePlantsQuery();
    const { addPlant, linkSensor } = usePlantMutations();

    return (
        <AppShell header={{ height: 60 }} padding="md">
            <AppHeader onAddClick={() => setAddModalOpen(true)} />
            <AppShell.Main>
                <Container>
                    {plants && plants.length === 0 && !loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Text size="xl" fw={500} mb="xl">
                                目前無植物
                            </Text>
                            <Button
                                onClick={() => setAddModalOpen(true)}
                                size="lg"
                            >
                                開始創建
                            </Button>
                        </div>
                    ) : (
                        <SimpleGrid
                            cols={{ base: 1, sm: 2, md: 3 }}
                            spacing="md"
                        >
                            {(plants ?? []).map((plant) => (
                                <PlantCard
                                    key={plant.id}
                                    plant={plant}
                                    onLinkSensor={(
                                        plantId: string,
                                        sensorId: string
                                    ) => linkSensor({ plantId, sensorId })}
                                />
                            ))}
                        </SimpleGrid>
                    )}
                </Container>
            </AppShell.Main>

            <AddPlantModal
                opened={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                onAddPlant={addPlant}
            />
        </AppShell>
    );
}
