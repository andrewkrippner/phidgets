const phidget = require('phidget22')
const express = require('express')
const cors = require('cors')

const zeros = [0, 0, 0, 0, 0, 0, 0, 0]
const pressures = [0, 0, 0, 0, 0, 0, 0, 0]

const createPressureSensor = async (channelNumber) => {
    const input = new phidget.VoltageRatioInput()
    input.setDeviceSerialNumber(149403)
    input.setChannel(channelNumber)
    await input.open(5000)
    input.setSensorType(phidget.VoltageRatioSensorType.PN_1137)
    input.setDataInterval(1000)
    input.onSensorChange = (pressure) => {
        pressures[channelNumber] = pressure
    }
    return input
}

const run = async () => {
    const pressureSensors = [
        await createPressureSensor(0),
        await createPressureSensor(1),
        await createPressureSensor(2),
        await createPressureSensor(3),
        await createPressureSensor(4),
        await createPressureSensor(5),
        await createPressureSensor(6),
        await createPressureSensor(7),
    ]
    process.on('SIGINT', () => {
        pressureSensors.map((ps) => ps.close())
        process.kill(0)
    })
}

const connection = new phidget.Connection(5661, 'localhost')
connection.connect().then(run)

const app = express()

app.use(cors())

app.get('/', (_, res) =>
    res.send({
        time: new Date().getTime(),
        p0: pressures[0] - zeros[0],
        p1: pressures[1] - zeros[1],
        p2: pressures[2] - zeros[2],
        p3: pressures[3] - zeros[3],
        p4: pressures[4] - zeros[4],
        p5: pressures[5] - zeros[5],
        p6: pressures[6] - zeros[6],
        p7: pressures[7] - zeros[7],
    })
)

app.post('/zero', (_, res) => {
    zeros[0] = pressures[0]
    zeros[1] = pressures[1]
    zeros[2] = pressures[2]
    zeros[3] = pressures[3]
    zeros[4] = pressures[4]
    zeros[5] = pressures[5]
    zeros[6] = pressures[6]
    zeros[7] = pressures[7]
    res.send('ok')
})

app.listen(5000)
