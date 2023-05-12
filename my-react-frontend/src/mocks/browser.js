import {setupWorker, rest} from 'msw'; 
import mockData from './events.data.json'

const worker = setupWorker(rest.get('/api/events', async (req, res, ctx) => {
    return res(
        ctx.json(mockData)
        )
})); 

worker.start(); 