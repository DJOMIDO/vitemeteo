const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast"

const conditions = {
  0: { labels: ["Ciel dégagé", "Clear sky", "晴朗"], icon: "☀️" },
  1: { labels: ["Principalement dégagé", "Mainly clear", "基本晴朗"], icon: "🌤️" },
  2: { labels: ["Partiellement nuageux", "Partly cloudy", "局部多云"], icon: "⛅" },
  3: { labels: ["Couvert", "Overcast", "阴天"], icon: "☁️" },
  45: { labels: ["Brouillard", "Fog", "雾"], icon: "🌫️" },
  48: { labels: ["Brouillard givrant", "Rime fog", "冻雾"], icon: "🌫️" },
  51: { labels: ["Bruine légère", "Light drizzle", "小雨"], icon: "🌦️" },
  53: { labels: ["Bruine modérée", "Moderate drizzle", "中雨"], icon: "🌦️" },
  55: { labels: ["Bruine dense", "Dense drizzle", "大雨"], icon: "🌧️" },
  56: { labels: ["Bruine verglaçante", "Freezing drizzle", "冻雨"], icon: "🌧️" },
  57: { labels: ["Bruine verglaçante dense", "Dense freezing drizzle", "强冻雨"], icon: "🌧️" },
  61: { labels: ["Pluie légère", "Light rain", "小雨"], icon: "🌦️" },
  63: { labels: ["Pluie modérée", "Moderate rain", "中雨"], icon: "🌧️" },
  65: { labels: ["Forte pluie", "Heavy rain", "大雨"], icon: "🌧️" },
  66: { label: "Pluie verglaçante", icon: "🌧️" },
  67: { label: "Forte pluie verglaçante", icon: "🌧️" },
  71: { label: "Neige légère", icon: "🌨️" },
  73: { label: "Neige modérée", icon: "🌨️" },
  75: { label: "Forte neige", icon: "❄️" },
  77: { label: "Grains de neige", icon: "❄️" },
  80: { labels: ["Averses légères", "Light showers", "阵雨"], icon: "🌦️" },
  81: { labels: ["Averses modérées", "Moderate showers", "中阵雨"], icon: "🌧️" },
  82: { labels: ["Fortes averses", "Heavy showers", "强阵雨"], icon: "⛈️" },
  85: { labels: ["Averses de neige", "Snow showers", "阵雪"], icon: "🌨️" },
  86: { labels: ["Fortes averses de neige", "Heavy snow showers", "强阵雪"], icon: "❄️" },
  95: { labels: ["Orage", "Thunderstorm", "雷雨"], icon: "⛈️" },
  96: { labels: ["Orage avec grêle", "Thunderstorm with hail", "雷雨伴冰雹"], icon: "⛈️" },
  99: { labels: ["Orage et forte grêle", "Thunderstorm with heavy hail", "雷雨伴强冰雹"], icon: "⛈️" },
}

const requestJson = async (url, signal) => {
  const timeoutController = new AbortController()
  let timedOut = false
  const timeoutRequest = () => {
    timedOut = true
    timeoutController.abort()
  }
  const activeTimeoutId = setTimeout(timeoutRequest, 10000)
  const abortRequest = () => timeoutController.abort()
  signal?.addEventListener("abort", abortRequest, { once: true })
  try {
    const response = await fetch(url, { signal: timeoutController.signal })
    if (!response.ok) throw new Error("Le service météo est momentanément indisponible.")
    return await response.json()
  } catch (error) {
    if (timedOut) {
      throw new Error("La requête météo a pris trop de temps. Vérifie ta connexion puis réessaie.")
    }
    if (error.name === "AbortError") throw error
    throw error
  } finally {
    clearTimeout(activeTimeoutId)
    signal?.removeEventListener("abort", abortRequest)
  }
}

export const getCondition = (code, locale = "fr") => {
  const condition = conditions[code] || { labels: ["Conditions inconnues", "Unknown conditions", "未知天气"], icon: "🌡️" }
  const labels = condition.labels || [condition.label, condition.label, condition.label]
  return { ...condition, label: labels[locale === "en" ? 1 : locale === "zh" ? 2 : 0] }
}

export const searchCities = async (query, signal, language = "fr") => {
  const params = new URLSearchParams({ name: query, count: "6", language, format: "json" })
  const data = await requestJson(`${GEOCODING_URL}?${params}`, signal)
  return (data.results || []).map((place) => ({
    id: `${place.latitude}:${place.longitude}`,
    name: place.name,
    region: place.admin1 || "",
    country: place.country || "",
    latitude: place.latitude,
    longitude: place.longitude,
    timezone: place.timezone,
  }))
}

export const getWeather = async (place, signal) => {
  const params = new URLSearchParams({
    latitude: place.latitude,
    longitude: place.longitude,
    timezone: "auto",
    forecast_days: "10",
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",
    hourly: "temperature_2m,apparent_temperature,weather_code,precipitation_probability,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,wind_speed_10m_max",
  })
  const data = await requestJson(`${FORECAST_URL}?${params}`, signal)
  const currentHour = Math.max(0, data.hourly.time.findIndex((time) => time >= data.current.time))
  const hourly = data.hourly.time.slice(currentHour, currentHour + 24).map((time, index) => {
    const sourceIndex = currentHour + index
    return {
      time,
      temperature: data.hourly.temperature_2m[sourceIndex],
      code: data.hourly.weather_code[sourceIndex],
      precipitationProbability: data.hourly.precipitation_probability[sourceIndex],
      windSpeed: data.hourly.wind_speed_10m[sourceIndex],
    }
  })

  return {
    location: { ...place, localTime: data.current.time, timezone: data.timezone },
    current: {
      temperature: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
      windSpeed: data.current.wind_speed_10m,
      isDay: data.current.is_day,
      code: data.current.weather_code,
    },
    hourly,
    daily: data.daily.time.map((date, index) => ({
      date,
      code: data.daily.weather_code[index],
      max: data.daily.temperature_2m_max[index],
      min: data.daily.temperature_2m_min[index],
      precipitationProbability: data.daily.precipitation_probability_max[index],
      windSpeed: data.daily.wind_speed_10m_max[index],
      sunrise: data.daily.sunrise[index],
      sunset: data.daily.sunset[index],
    })),
    updatedAt: data.current.time,
  }
}

export const getWeatherByCoordinates = async (latitude, longitude, signal, language = "fr") => {
  const places = await searchCities(`${latitude},${longitude}`, signal, language)
  const place = places[0] || {
    id: `${latitude}:${longitude}`,
    name: "Ma position",
    region: "",
    country: "",
    latitude,
    longitude,
  }
  return getWeather(place, signal)
}
