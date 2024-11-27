import fs from 'fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;
  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // dbFilePath: string = '/Users/erinmckanna/bootcamp/Weather-Dashboard/server/db/db.json';
  dbFilePath: string = path.join(__dirname, '../../db/db.json');
    
//   // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    const data = await fs.promises.readFile(this.dbFilePath, 'utf-8');
    return JSON.parse(data);
  }
//   // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    await fs.promises.writeFile(this.dbFilePath, JSON.stringify(cities, null, 2));
  }
//   // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const cities = await this.read();
    return cities;
  }
//   // TODO Define an addCity method that adds a city to the searchHistory.json file
async addCity(city: string) {
    const cities = await this.read();
    const newCity = new City(city, cities.length.toString());
    cities.push(newCity);
    await this.write(cities);
}
}
//   // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file}

export default new HistoryService();
