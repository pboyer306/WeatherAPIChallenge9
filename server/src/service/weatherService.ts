import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
 interface Coordinates {
  lat: number;
  lon: number;
 }

// TODO: Define a class for the Weather object
class Weather {
     city: string;
     country: string;
     date: string;
     description: string;
     feelsLike: number;
     humidity: number;
     icon: string;
     temp: number;
     wind: number;

      constructor(city: string, country: string, date: string, description: string, feelsLike: number, humidity: number, icon: string, temp: number, wind: number) {
            this.city = city;
            this.country = country;
            this.date = date;
            this.description = description;
            this.feelsLike = feelsLike;
            this.humidity = humidity;
            this.icon = icon;
            this.temp = temp;
            this.wind = wind;
      }
}
   

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string = 'http://api.openweathermap.org/';
  private apiKey: string | undefined = process.env.API_KEY;
  private cityName: string = '';

  constructor() {
    this.fetchLocationData = this.fetchLocationData.bind(this);
    this.destructureLocationData = this.destructureLocationData.bind(this);
    this.buildGeocodeQuery = this.buildGeocodeQuery.bind(this);
    this.buildWeatherQuery = this.buildWeatherQuery.bind(this);
    this.fetchAndDestructureLocationData = this.fetchAndDestructureLocationData.bind(this);
    this.fetchWeatherData = this.fetchWeatherData.bind(this);
    this.parseCurrentWeather = this.parseCurrentWeather.bind(this);
    this.buildForecastArray = this.buildForecastArray.bind(this);
    this.getWeatherForCity = this.getWeatherForCity.bind(this);
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response = await fetch(`${this.baseURL}geo/1.0/direct?q=${query}&limit=5&appid=${this.apiKey}`);
    const data = await response.json();
    return data[0];
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.cityName}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    return `lat=${lat}&lon=${lon}&exclude=minutely&appid=${this.apiKey}&units=imperial`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(`${this.baseURL}data/2.5/weather?${this.buildWeatherQuery(coordinates)}`);
    const data = await response.json();
    return data
  }
  private async fetchForecastData(coordinates: Coordinates) {
    const response = await fetch(`${this.baseURL}data/2.5/forecast?${this.buildWeatherQuery(coordinates)}`);
    const data = await response.json();
    return data
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const { name: city, sys: { country }, dt } = response;
    const { description, icon } = response.weather[0];
    const { feels_like: feelsLike, humidity, temp } = response.main;
    const { speed: wind } = response.wind;
    const date = new Date(dt * 1000).toLocaleDateString();
    return new Weather(city, country, date, description, feelsLike, humidity, icon, temp, wind);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const filteredWeather = weatherData.filter((data) => {
      const { dt_txt } = data;
      return dt_txt.includes('12:00:00');
    });
    return filteredWeather.map((data) => {
      const { dt } = data;
      const date = new Date(dt * 1000).toLocaleDateString();
      const { description, icon } = data.weather[0];
      const { feels_like: feelsLike, humidity, temp } = data.main;
      const { speed: wind } = data.wind;
      return new Weather(currentWeather.city, currentWeather.country, date, description, feelsLike, humidity, icon, temp, wind);
    });
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastData = await this.fetchForecastData(coordinates);
    const forecast = this.buildForecastArray(currentWeather, forecastData.list);
    return [ currentWeather, ...forecast ];
  }
}

export default new WeatherService();
