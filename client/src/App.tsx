// client/src/App.tsx
import { useState } from 'react';
import axios from 'axios';
import './App.css'; 

// Define the TypeScript interface for the data we expect from our backend
interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || ''; 


  const fetchWeather = async () => {
    setLoading(true);
    setError('');
    
    if (!BACKEND_URL) {
        setError("Backend URL is missing in client/.env file.");
        setLoading(false);
        return;
    }

    try {
      // THIS CALLS YOUR EXPRESS BACKEND
      const response = await axios.get(`${BACKEND_URL}/api/weather/${city}`);
      setWeather(response.data);
      setCity(''); 
    } catch (err) {
      setError('City not found or server error. Check if your backend is running.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather();
    }
  };

  return (
    <div className="App">
      <header>
        <h1>My Weather App</h1>
      </header>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Fetching...' : 'Get Weather'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>{weather.name}</h2>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Condition: {weather.weather.description}</p>
          <img
            src={`openweathermap.org{weather.weather.icon}.png`}
            alt={weather.weather.description}
          />
        </div>
      )}
    </div>
  );
}

export default App;
