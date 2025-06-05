import { useQuery } from "@tanstack/react-query";
import { getDailyAdvice } from "@/services/adviceService";
import type { DailyAdvice } from "@/models/entity/DailyAdvice";

// 取得每日建議
export function useAdviceQuery() {
    return useQuery<DailyAdvice>({
        queryKey: ["advice"],
        queryFn: getDailyAdvice,
    });
}
