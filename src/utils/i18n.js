import { inject } from "vue"

export const supportedLocales = ["fr", "en", "zh"]

export const messages = {
  fr: {
    search: "Rechercher une ville…", locate: "Utiliser ma position", results: "Résultats de recherche",
    searching: "Recherche…", noResults: "Aucune ville trouvée.", nav: "Navigation principale",
    localForecast: "Prévisions locales", refresh: "Actualiser", remove: "Supprimer",
    feelsLike: "Ressenti", humidity: "Humidité", wind: "Vent", precipitation: "Précipitations",
    sunrise: "Lever du soleil", sunset: "Coucher du soleil", nextHours: "Prochaines heures",
    longTerm: "Long terme", tenDays: "Prévisions à 10 jours", today: "Aujourd’hui",
    current: "Maint.", rain: "pluie", windDetail: "Vent", updated: "Mis à jour à",
    emptyTitle: "Quel temps fait-il ailleurs ?", emptyText: "Recherche une ville pour construire ton tableau météo personnel.",
    useLocation: "Utiliser ma position", loading: "Chargement de la météo…", provider: "Données météo par",
    units: "Unité de température", previous: "Afficher les heures précédentes", next: "Afficher les heures suivantes",
    celsius: "Celsius", fahrenheit: "Fahrenheit", themeLight: "Activer le mode clair", themeDark: "Activer le mode sombre",
    language: "Changer de langue", restoredError: "Impossible de restaurer les villes enregistrées.",
  },
  en: {
    search: "Search for a city…", locate: "Use my location", results: "Search results",
    searching: "Searching…", noResults: "No city found.", nav: "Main navigation",
    localForecast: "Local forecast", refresh: "Refresh", remove: "Remove",
    feelsLike: "Feels like", humidity: "Humidity", wind: "Wind", precipitation: "Precipitation",
    sunrise: "Sunrise", sunset: "Sunset", nextHours: "Next hours", longTerm: "Long range",
    tenDays: "10-day forecast", today: "Today", current: "Now", rain: "rain",
    windDetail: "Wind", updated: "Updated at", emptyTitle: "What’s the weather like elsewhere?",
    emptyText: "Search for a city to build your personal weather board.", useLocation: "Use my location",
    loading: "Loading weather…", provider: "Weather data by", units: "Temperature unit",
    previous: "Show previous hours", next: "Show next hours", celsius: "Celsius", fahrenheit: "Fahrenheit",
    themeLight: "Enable light mode", themeDark: "Enable dark mode", language: "Change language",
    restoredError: "Unable to restore saved cities.",
  },
  zh: {
    search: "搜索城市…", locate: "使用我的位置", results: "搜索结果",
    searching: "搜索中…", noResults: "未找到城市。", nav: "主导航",
    localForecast: "本地预报", refresh: "刷新", remove: "删除",
    feelsLike: "体感", humidity: "湿度", wind: "风速", precipitation: "降水",
    sunrise: "日出", sunset: "日落", nextHours: "未来几小时", longTerm: "长期预报",
    tenDays: "10日预报", today: "今天", current: "当前", rain: "降雨",
    windDetail: "风速", updated: "更新时间", emptyTitle: "其他地方的天气如何？",
    emptyText: "搜索城市，建立你的个人天气面板。", useLocation: "使用我的位置",
    loading: "天气加载中…", provider: "天气数据来自", units: "温度单位",
    previous: "显示前几个小时", next: "显示后几个小时", celsius: "摄氏度", fahrenheit: "华氏度",
    themeLight: "切换到明亮模式", themeDark: "切换到暗黑模式", language: "切换语言",
    restoredError: "无法恢复已保存的城市。",
  },
}

export const useI18n = () => ({
  locale: inject("locale"),
  t: inject("t"),
})
