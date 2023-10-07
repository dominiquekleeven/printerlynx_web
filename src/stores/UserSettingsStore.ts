import { defineStore } from 'pinia'

export const useUserSettingsStore = defineStore('userSettings', {
    state: () => ({
        theme: 'dark',
        temperatureUnit: 'celsius',
        debug: false,
        previewGCode: true,
    }),

    getters: {
    },

    actions: {
        setTheme(theme: Theme) {
            this.theme = theme
        },

        setTemperatureUnit(unit: TemperatureUnit) {
            this.temperatureUnit = unit
        },

        setDebug(debug: boolean) {
            this.debug = debug
        },

        setPreviewGCode(preview: boolean) {
            this.previewGCode = preview
        }

    },
})

enum Theme {
    Dark = 'dark',
    Light = 'light',
}

enum TemperatureUnit {
    Celsius = 'celsius',
    Fahrenheit = 'fahrenheit',
}



