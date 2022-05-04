export interface PressureHistoryDataPoint {
    time: number
    p0: number
    p1: number
    p2: number
    p3: number
    p4: number
    p5: number
    p6: number
    p7: number
}

export type PressureHistory = PressureHistoryDataPoint[]
