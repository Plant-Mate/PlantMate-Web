import { DailyAdvice } from "@/models/entity/DailyAdvice";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getDailyAdvice = async (): Promise<DailyAdvice> => {
    const res = await fetch(`${BACKEND_URL}/api/agents/daily-advice`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch");
    console.log("Fetching daily advice");

    const data = await res.json();
    return {
        advice: data.advice as string,
        date: data.generated_date as string,
    } as DailyAdvice;
};
