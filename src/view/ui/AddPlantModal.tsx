import React, { useState } from "react";
import { Modal, Button, Group, Stepper, TextInput } from "@mantine/core";
import type { PlantRequest } from "@/models/dto/PlantDto";

interface AddPlantModalProps {
    opened: boolean;
    onClose: () => void;
    onAddPlant: (plant: PlantRequest) => void;
}

export const AddPlantModal: React.FC<AddPlantModalProps> = ({
    opened,
    onClose,
    onAddPlant,
}) => {
    const [active, setActive] = useState(0);
    const [plantData, setPlantData] = useState({
        name: "",
        species: "",
        description: "",
    });

    const handleInputChange =
        (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
            setPlantData({
                ...plantData,
                [field]: event.target.value,
            });
        };

    const nextStep = () =>
        setActive((current) => (current < 3 ? current + 1 : current));
    const prevStep = () =>
        setActive((current) => (current > 0 ? current - 1 : current));

    const handleSubmit = () => {
        onAddPlant({
            name: plantData.name,
            species: plantData.species,
            description: plantData.description,
        });

        // 重置表單
        setPlantData({
            name: "",
            species: "",
            description: "",
        });
        setActive(0);
        onClose();
    };

    const handleClose = () => {
        // 重置表單
        setPlantData({
            name: "",
            species: "",
            description: "",
        });
        setActive(0);
        onClose();
    };

    return (
        <Modal opened={opened} onClose={handleClose} title="新增植物" size="lg">
            <div className="p-4">
                <Stepper active={active} onStepClick={setActive} mb="xl">
                    <Stepper.Step label="植物名稱" description="為您的植物取名">
                        <TextInput
                            label="植物名稱"
                            placeholder="例如：小綠"
                            value={plantData.name}
                            onChange={handleInputChange("name")}
                            required
                            className="mb-4"
                        />
                    </Stepper.Step>

                    <Stepper.Step label="植物種類" description="選擇植物種類">
                        <TextInput
                            label="植物種類"
                            placeholder="例如：多肉植物、香草"
                            value={plantData.species}
                            onChange={handleInputChange("species")}
                            required
                            className="mb-4"
                        />
                    </Stepper.Step>

                    <Stepper.Step label="植物介紹" description="描述您的植物">
                        <TextInput
                            label="植物介紹"
                            placeholder="介紹一下您的植物..."
                            value={plantData.description}
                            onChange={handleInputChange("description")}
                            className="mb-4"
                        />
                    </Stepper.Step>
                </Stepper>

                <Group justify="space-between" mt="xl">
                    {active !== 0 && (
                        <Button variant="default" onClick={prevStep}>
                            上一步
                        </Button>
                    )}
                    {active !== 2 ? (
                        <Button
                            onClick={nextStep}
                            disabled={
                                (active === 0 && !plantData.name) ||
                                (active === 1 && !plantData.species)
                            }
                        >
                            下一步
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit}>確認創建</Button>
                    )}
                </Group>
            </div>
        </Modal>
    );
};
