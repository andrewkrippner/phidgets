import { PressureHistoryDataPoint } from './types'

const baseUrl = 'http://localhost:5000'

export const getPressureData = async () => {
    const url = `${baseUrl}/`
    const res = await fetch(url)
    const pressureData = (await res.json()) as PressureHistoryDataPoint
    return pressureData
}

export const zeroPressureSensors = async () => {
    const url = `${baseUrl}/zero`
    const reqInit: RequestInit = { method: 'post' }
    const res = await fetch(url, reqInit)
    return res
}
