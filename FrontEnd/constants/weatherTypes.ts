// FrontEnd/constants/weatherTypes.ts

export interface WeatherType {
    key: string;
    label: string;
    color: string;
    iconCode: string; // OpenWeatherMap icon code
}

// Maps OpenWeatherMap main conditions to our app's disaster types
export const DISASTER_TYPES: WeatherType[] = [
    { key: 'Thunderstorm', label: 'Storm', color: '#6a1b9a', iconCode: '11d' },
    { key: 'Drizzle', label: 'Drizzle', color: '#81d4fa', iconCode: '09d' },
    { key: 'Rain', label: 'Rain', color: '#2196F3', iconCode: '10d' },
    { key: 'Snow', label: 'Snow', color: '#e3f2fd', iconCode: '13d' },
    { key: 'Clear', label: 'Clear', color: '#FFC107', iconCode: '01d' },
    { key: 'Clouds', label: 'Clouds', color: '#9e9e9e', iconCode: '03d' },
    // Atmosphere group from OpenWeatherMap
    { key: 'Mist', label: 'Mist', color: '#b0bec5', iconCode: '50d' },
    { key: 'Smoke', label: 'Smoke', color: '#757575', iconCode: '50d' },
    { key: 'Haze', label: 'Haze', color: '#a1887f', iconCode: '50d' },
    { key: 'Dust', label: 'Dust', color: '#bcaaa4', iconCode: '50d' },
    { key: 'Fog', label: 'Fog', color: '#cfd8dc', iconCode: '50d' },
    { key: 'Sand', label: 'Sand', color: '#d7ccc8', iconCode: '50d' },
    { key: 'Ash', label: 'Ash', color: '#616161', iconCode: '50d' },
    { key: 'Squall', label: 'Squall', color: '#455a64', iconCode: '50d' },
    { key: 'Tornado', label: 'Tornado', color: '#37474f', iconCode: '50d' },
];

/**
 * Constructs the full URL for an OpenWeatherMap icon.
 * @param iconCode The icon code from the API (e.g., "01d", "10n").
 * @returns The full URL to the icon image.
 */
export const getWeatherIconUrl = (iconCode: string): string => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};
