"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    AppShell,
    Container,
    Text,
    Button,
    Paper,
    Tabs,
    TextInput,
} from "@mantine/core";
import { AppHeader } from "../../../view/ui/AppHeader";
import { Plant } from "../../../models/entity/Plant";
import { PlantChatSection } from "../../../view/ui/PlantChatSection";
import { PlantDataSection } from "../../../view/ui/PlantDataSection";
import { PlantCareAdviceSection } from "../../../view/ui/PlantCareAdviceSection";
import { usePlantsQuery } from "@/viewmodels/hooks/usePlantsQuery";
import { usePlantMutations } from "@/viewmodels/hooks/usePlantMutation";

interface PlantDetailPageProps {
    params: {
        id: string;
    };
}

export default function PlantDetailPage({ params }: PlantDetailPageProps) {
    // 使用 React.use() 解析 params
    const resolvedParams = React.use(params);
    const id = resolvedParams.id;

    const router = useRouter();
    const { data: plants } = usePlantsQuery();
    const { updatePlantAsync } = usePlantMutations();
    const [plant, setPlant] = useState<Plant | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        name: "",
        species: "",
        description: "",
    });
    const [, setAddModalOpen] = useState(false);

    useEffect(() => {
        const plant = plants?.find((p) => p.id === id);
        if (plant) {
            setPlant(plant);
            setEditData({
                name: plant.name,
                species: plant.species,
                description: plant.description || "",
            });
        } else {
            // 找不到植物資料，返回主頁
            // router.push("/");
        }
    }, [id, plants, router]);

    const handleEditChange =
        (field: keyof typeof editData) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setEditData({
                ...editData,
                [field]: event.target.value,
            });
        };

    const handleSaveChanges = async () => {
        if (!plant) return;

        const updatedPlant = await updatePlantAsync({
            id: plant.id,
            data: editData,
        });

        if (updatedPlant) {
            setPlant(updatedPlant);
            setIsEditing(false);
        }
    };

    if (!plant) {
        return (
            <AppShell header={{ height: 60 }} padding="md">
                <AppHeader onAddClick={() => setAddModalOpen(true)} />
                <AppShell.Main pt={20}>
                    <Container>
                        <Text>載入中...</Text>
                    </Container>
                </AppShell.Main>
            </AppShell>
        );
    }

    return (
        <AppShell header={{ height: 60 }} padding="md">
            <AppHeader onAddClick={() => setAddModalOpen(true)} />
            <AppShell.Main pt={20}>
                <Container>
                    <div className="mb-6 flex justify-between items-center">
                        <Button
                            variant="subtle"
                            leftSection="←"
                            onClick={() => router.push("/")}
                        >
                            返回
                        </Button>
                        <Text size="xl" fw={700}>
                            {plant.name}
                        </Text>
                        <div style={{ width: "80px" }}></div>{" "}
                        {/* 為了平衡佈局 */}
                    </div>

                    <Tabs defaultValue="info">
                        <Tabs.List grow>
                            <Tabs.Tab value="info">基本資訊</Tabs.Tab>
                            <Tabs.Tab value="chat">聊天室</Tabs.Tab>
                            <Tabs.Tab value="data">觀測數據</Tabs.Tab>
                            <Tabs.Tab value="care">每日照護建議</Tabs.Tab>
                        </Tabs.List>

                        <Paper p="md" mt="md" radius="md" withBorder>
                            <Tabs.Panel value="info">
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <TextInput
                                            label="植物名稱"
                                            value={editData.name}
                                            onChange={handleEditChange("name")}
                                        />
                                        <TextInput
                                            label="植物種類"
                                            value={editData.species}
                                            onChange={handleEditChange(
                                                "species"
                                            )}
                                        />
                                        <TextInput
                                            label="植物介紹"
                                            value={editData.description}
                                            onChange={handleEditChange(
                                                "description"
                                            )}
                                        />
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="default"
                                                onClick={() =>
                                                    setIsEditing(false)
                                                }
                                            >
                                                取消
                                            </Button>
                                            <Button onClick={handleSaveChanges}>
                                                儲存變更
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <Text fw={500} size="sm" c="dimmed">
                                                植物名稱
                                            </Text>
                                            <Text size="lg">{plant.name}</Text>
                                        </div>
                                        <div>
                                            <Text fw={500} size="sm" c="dimmed">
                                                植物種類
                                            </Text>
                                            <Text size="lg">
                                                {plant.species}
                                            </Text>
                                        </div>
                                        <div>
                                            <Text fw={500} size="sm" c="dimmed">
                                                植物介紹
                                            </Text>
                                            <Text size="lg">
                                                {plant.description || "無介紹"}
                                            </Text>
                                        </div>
                                        <div>
                                            <Text fw={500} size="sm" c="dimmed">
                                                感測器狀態
                                            </Text>
                                            <Text size="lg">
                                                {plant.sensorId
                                                    ? `已連結 (${plant.sensorId})`
                                                    : "未連結"}
                                            </Text>
                                        </div>
                                        <div>
                                            <Text fw={500} size="sm" c="dimmed">
                                                創建時間
                                            </Text>
                                            <Text size="lg">
                                                {new Date(
                                                    plant.createdAt
                                                ).toLocaleString()}
                                            </Text>
                                        </div>
                                        <div className="flex justify-end">
                                            <Button
                                                onClick={() =>
                                                    setIsEditing(true)
                                                }
                                            >
                                                編輯資訊
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Tabs.Panel>

                            <Tabs.Panel value="chat">
                                <PlantChatSection plantId={plant.id} />
                            </Tabs.Panel>

                            <Tabs.Panel value="data">
                                <PlantDataSection plantId={plant.id} />
                            </Tabs.Panel>

                            <Tabs.Panel value="care">
                                <PlantCareAdviceSection plantId={plant.id} />
                            </Tabs.Panel>
                        </Paper>
                    </Tabs>
                </Container>
            </AppShell.Main>
        </AppShell>
    );
}
