import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  const weather = await WeatherService.getWeatherForCity(req.body.cityName);
  await HistoryService.addCity(req.body.cityName);
  res.send(weather);
  // TODO: save city to search history
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  const history = await HistoryService.getCities();
  res.send(history);
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  res.send(`${req.params.id} deleted from search history`);
});

export default router;
