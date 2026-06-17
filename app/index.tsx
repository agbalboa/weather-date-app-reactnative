import { Platform, StyleSheet, View, Text } from 'react-native';

import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

const WEATHER_CODE_LABELS: Record<number, string> = {
  0: 'Clear',
  1: 'Mostly Clear',
  2: 'Partly Cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Rime Fog',
  51: 'Light Drizzle',
  53: 'Drizzle',
  55: 'Heavy Drizzle',
  56: 'Light Freezing Drizzle',
  57: 'Freezing Drizzle',
  61: 'Light Rain',
  63: 'Rainy',
  65: 'Heavy Rain',
  66: 'Light Freezing Rain',
  67: 'Freezing Rain',
  71: 'Light Snow',
  73: 'Snowy',
  75: 'Heavy Snow',
  77: 'Snow Grains',
  80: 'Rain Showers',
  81: 'Heavy Showers',
  82: 'Violent Showers',
  85: 'Snow Showers',
  86: 'Heavy Snow Showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with Hail',
  99: 'Severe Thunderstorm with Hail',
};

export default function HomeScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentWeather, setCurrentWeather] = useState('Loading...');
  const [currentTempC, setCurrentTempC] = useState<number | null>(null);
  const [currentHumidity, setCurrentHumidity] = useState<number | null>(null);
  const [currentWindKph, setCurrentWindKph] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const latitude = 14.066667;
    const longitude = 120.633333;

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&timezone=auto`
        );
        const data = await response.json();

        const temperature = data?.current?.temperature_2m;
        const weatherCode = data?.current?.weather_code;
        const humidity = data?.current?.relative_humidity_2m;
        const windSpeed = data?.current?.wind_speed_10m;

        if (typeof temperature === 'number') {
          setCurrentTempC(temperature);
        }

        if (typeof weatherCode === 'number') {
          setCurrentWeather(WEATHER_CODE_LABELS[weatherCode] ?? 'Unknown');
        }

        if (typeof humidity === 'number') {
          setCurrentHumidity(humidity);
        }

        if (typeof windSpeed === 'number') {
          setCurrentWindKph(windSpeed);
        }
      } catch {
        setCurrentWeather('Unavailable');
      }
    };

    fetchWeather();
    const weatherTimer = setInterval(fetchWeather, 10 * 60 * 1000);

    return () => clearInterval(weatherTimer);
  }, []);
   
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4a0e17', '#2a080c']}
        style={styles.background}
      >
      
      <View style={styles.locationContainer}>
        <MaterialIcons name="location-pin" size={18} color="#d4af37" />
        <Text style={styles.locationFont}>NASUGBU BATANGAS, PH</Text>
      </View>

      {/* current time */}
      <View style={styles.styledContainer}>
        <View style={styles.titleRow}>
          <MaterialIcons name="access-time" size={14} color="#d4af37" />
          <Text style={styles.subtitle}>CURRENT TIME</Text>
        </View>

          <Text style={styles.textTime}>{currentTime.toLocaleTimeString()}</Text>

        <View style={styles.subtitleRow}>
          <MaterialIcons name="date-range" size={14} color="#a3a3a3" />
          <Text style={styles.lowerSubtitle}>
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
        </Text>
        </View>
      </View>

      {/* weather */}
      <View style={styles.styledContainer}>
        <View style={styles.titleRow}>
          <MaterialIcons name="cloud" size={14} color="#d4af37" />
          <Text style={styles.subtitle}>WEATHER UPDATES</Text>
        </View>

          <Text style={styles.temp}>
            {currentTempC !== null ? `${Math.round(currentTempC)}°C` : '--'}
          </Text>
          <Text style={styles.weather}>{currentWeather}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>HUMIDITY</Text>
              <Text style={styles.statValue}>
                {currentHumidity !== null ? `${Math.round(currentHumidity)}%` : '--'}
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statLabel}>WIND</Text>
              <Text style={styles.statValue}>
                {currentWindKph !== null ? `${Math.round(currentWindKph)} km/h` : '--'}
              </Text>
            </View>
          </View>
      </View>

      {/* current time */}
      <View style={styles.styledContainer}>
        <View style={styles.titleRow}>
          <Ionicons name="logo-react" size={14} color="#d4af37" />
          <Text style={styles.subtitle}>REACT NATIVE</Text>
        </View>
        <Text style={styles.name}>SIR MAGS</Text>
      </View>

      {/* footer */}
      <View style={styles.footer}>
        <Ionicons name="logo-react" size={14} color="#d4af37" />
        <Text style={styles.footerText}>REACT NATIVE - LIVE MONITORS</Text>
      </View>

      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 44,
  },
  styledContainer: {
    flexDirection: 'column',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    width: 350,
    margin: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    width: '55%',
    padding: 10,
    marginTop: Platform.OS === 'ios' ? 70 : 20,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  locationFont: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#d4af37',
    letterSpacing: 1,
  },
  lowerSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#a3a3a3',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 16,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textTime: {
    fontSize: 40,
    fontWeight: '700',
    color: '#ffffff',
    paddingBottom: 12,
  },
  temp: {
    fontSize: 40,
    fontWeight: '900',
    color: '#ffffff',
  },
  weather: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    paddingBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#b9a7ad',
  },
  statValue: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  statDivider: {
    width: 1,
    height: '66%',
    backgroundColor: 'rgba(255, 55, 255, 0.15)',
  },
  name: {
    fontSize: 40,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#a3a3a3',
  },
});