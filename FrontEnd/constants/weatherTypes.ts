export interface WeatherType {
    key: string;
    label: string;
    color: string;
    icon: string; // OpenWeatherMap icon code
}

// Maps OpenWeatherMap main conditions to our app's disaster types
export const weatherTypes: WeatherType[] = [
    { key: 'Thunderstorm', label: 'Storm', color: '#6a1b9a', icon: '11d' },
    { key: 'Drizzle', label: 'Drizzle', color: '#81d4fa', icon: '09d' },
    { key: 'Rain', label: 'Rain', color: '#2196F3', icon: '10d' },
    { key: 'Snow', label: 'Snow', color: '#e3f2fd', icon: '13d' },
    { key: 'Clear', label: 'Clear', color: '#FFC107', icon: '01d' },
    { key: 'Clouds', label: 'Clouds', color: '#9e9e9e', icon: '03d' },
    // Atmosphere group from OpenWeatherMap
    { key: 'Mist', label: 'Mist', color: '#b0bec5', icon: '50d' },
    { key: 'Smoke', label: 'Smoke', color: '#757575', icon: '50d' },
    { key: 'Haze', label: 'Haze', color: '#a1887f', icon: '50d' },
    { key: 'Dust', label: 'Dust', color: '#bcaaa4', icon: '50d' },
    { key: 'Fog', label: 'Fog', color: '#cfd8dc', icon: '50d' },
    { key: 'Sand', label: 'Sand', color: '#d7ccc8', icon: '50d' },
    { key: 'Ash', label: 'Ash', color: '#616161', icon: '50d' },
    { key: 'Squall', label: 'Squall', color: '#455a64', icon: '50d' },
    { key: 'Tornado', label: 'Tornado', color: '#37474f', icon: '50d' },
];

const defaultWeatherType: WeatherType = {
    key: 'Unknown',
    label: 'Weather',
    color: '#BDBDBD',
    icon: '01d', // Default to a clear sky icon
};

/**
 * Finds the weather details for a given weather key.
 * @param weatherKey The weather condition string (e.g., "Rain", "Clouds").
 * @returns The corresponding WeatherType object or a default.
 */
export const getWeatherDetails = (weatherKey: string): WeatherType => {
    const foundType = weatherTypes.find(type => type.key.toLowerCase() === weatherKey.toLowerCase());
    return foundType || defaultWeatherType;
};


/**
 * Constructs the full URL for an OpenWeatherMap icon.
 * @param iconCode The icon code from the API (e.g., "01d", "10n").
 * @returns The full URL to the icon image.
 */
export const getWeatherIconUrl = (iconCode: string): string => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

