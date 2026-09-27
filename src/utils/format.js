const languageMap = { fr: "fr-FR", en: "en-GB", zh: "zh-CN" }
export const formatDate = (value, options = {}, locale = "fr") =>
  new Intl.DateTimeFormat(languageMap[locale] || "fr-FR", { weekday: "short", day: "numeric", month: "short", ...options }).format(new Date(value))

export const formatTime = (value, locale = "fr") =>
  new Intl.DateTimeFormat(languageMap[locale] || "fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date(value))

export const formatHour = (value, locale = "fr") =>
  new Intl.DateTimeFormat(languageMap[locale] || "fr-FR", { hour: "2-digit" }).format(new Date(value))

export const formatTemperature = (value, unit) =>
  `${Math.round(unit === "F" ? value * 9 / 5 + 32 : value)}°`

export const formatWind = (value, unit) =>
  `${Math.round(unit === "F" ? value * 0.621371 : value)} ${unit === "F" ? "mi/h" : "km/h"}`
