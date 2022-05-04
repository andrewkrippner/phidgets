import { useEffect, useState } from 'react'
import { Button, H3 } from '@blueprintjs/core'
import PressureChart from './PressureChart'
import { PressureHistory } from './types'
import { getPressureData, zeroPressureSensors } from './api'

export const download = (blob: Blob, fileName: string, extension: string) => {
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = `${fileName}.${extension}`
    link.click()
}

const App = () => {
    const [paused, setPaused] = useState<boolean>(false)
    const [saving, setSaving] = useState<boolean>(false)
    const [maxLength] = useState<number>(50)
    const [pressureHistory, setPressureHistory] = useState<PressureHistory>([])
    const [recordedPressureHistory, setRecordedPressureHistory] =
        useState<PressureHistory>([])

    const handleRecordingButton = () => {
        if (saving) {
            const csv =
                'Time,p0,p1,p2,p3,p4,p5,p6,p7\n' +
                recordedPressureHistory
                    .map(
                        (p) =>
                            `${p.time},${p.p0},${p.p1},${p.p2},${p.p3},${p.p4},${p.p5},${p.p6},${p.p7}`
                    )
                    .join('\n')
            const blob = new Blob([csv])
            download(blob, 'Pressure History', 'csv')
            setSaving(false)
        } else {
            setSaving(true)
        }
    }

    useEffect(() => {
        if (paused) return
        const timeout = setTimeout(async () => {
            const currentPressureData = await getPressureData()
            const newPressureHistory = [...pressureHistory, currentPressureData]
            while (newPressureHistory.length > maxLength)
                newPressureHistory.shift()
            setPressureHistory(newPressureHistory)
        }, 1000)
        return () => clearTimeout(timeout)
    }, [paused, maxLength, pressureHistory])

    useEffect(() => {
        if (saving) {
            const lastPressureData = pressureHistory.at(-1)
            if (lastPressureData)
                setRecordedPressureHistory((recordedPressureHistory) => [
                    ...recordedPressureHistory,
                    lastPressureData,
                ])
        } else {
            setRecordedPressureHistory([])
        }
    }, [saving, pressureHistory])

    return (
        <div className='App'>
            <div className='header'>
                <H3>Gen1A Pressure Sensors</H3>
                <span className='flex' />
                <Button text='Clear' onClick={() => setPressureHistory([])} />
                <Button text='Zero' onClick={zeroPressureSensors} />
                <Button
                    icon={!paused ? 'pause' : 'play'}
                    text={!paused ? 'Pause' : 'Play'}
                    onClick={() => setPaused(!paused)}
                />
                <Button
                    icon={!saving ? 'record' : 'download'}
                    intent={saving ? 'danger' : 'primary'}
                    text={!saving ? 'Start Recording' : 'Finish and Download'}
                    onClick={handleRecordingButton}
                />
                {/* <FormGroup label='Max Length'>
                    <NumericInput
                        value={maxLength}
                        onValueChange={setMaxLength}
                    />
                </FormGroup> */}
            </div>
            <div className='chart-container'>
                <PressureChart pressureHistory={pressureHistory} />
            </div>
        </div>
    )
}

export default App
