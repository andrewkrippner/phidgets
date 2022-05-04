import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Label,
    Legend,
    Tooltip,
} from 'recharts'
import { PressureHistory } from './types'

const colors = [
    '#215DB0',
    '#1C6E42',
    '#C87619',
    '#AC2F33',
    '#634DBF',
    '#9D3F9D',
    '#68C1EE',
    '#946638',
]

const formatTime = (time: number) => {
    const delta = (new Date().getTime() - time) / 1000
    const seconds = delta % 60
    const minutes = Math.floor(delta / 60)
    return `-${minutes.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        maximumFractionDigits: 0,
        useGrouping: false,
    })}:${seconds.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        maximumFractionDigits: 0,
        useGrouping: false,
    })}`
}

interface PressureChartProps {
    pressureHistory: PressureHistory
}

const PressureChart = ({ pressureHistory }: PressureChartProps) => (
    <ResponsiveContainer>
        <LineChart data={pressureHistory}>
            <XAxis dataKey='time' tickFormatter={formatTime}>
                <Label
                    value='Time From Now [mm:ss]'
                    position='bottom'
                    offset={2}
                />
            </XAxis>
            <YAxis>
                <Label
                    value='Pressure [kPa]'
                    angle={270}
                    position='left'
                    offset={2}
                    style={{ textAnchor: 'middle' }}
                />
            </YAxis>
            <CartesianGrid stroke='#eee' strokeDasharray='5 5' />
            {Array.from(Array(8).keys()).map((i) => (
                <Line
                    key={i}
                    type='monotone'
                    isAnimationActive={false}
                    dataKey={`p${i}`}
                    stroke={colors[i]}
                    strokeWidth={2}
                />
            ))}
            <Legend verticalAlign='top' />
            <Tooltip />
        </LineChart>
    </ResponsiveContainer>
)

export default PressureChart
