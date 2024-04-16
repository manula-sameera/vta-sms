import { Demo } from '@/types';

export const CountryService = {
    getCountries() {
        return fetch('/data/data/countries.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Country[]);
    }
};
