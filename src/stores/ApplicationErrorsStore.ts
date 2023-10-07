// errorHandlingStore.js
import { ValidationError } from '@/types/ValidationError';
import { defineStore } from 'pinia';

export const useApplicationErrorsStore = defineStore('applicationErrorStore', {
    state: () => ({
        errors: [] as ValidationError[],
    }),
    actions: {
        addError(error: ValidationError) {

            this.clearErrors();
            this.errors.push(error);
        },

        addErrors(errors: ValidationError[]) {
            this.clearErrors();
            this.errors.push(...errors);
        },

        clearErrors() {
            this.errors = [];
        },
    },
});

