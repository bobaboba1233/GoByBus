// src/api/getCities.js
import axios from 'axios';

export const getCities = async (query) => {
  if (!query) return [];

  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        addressdetails: 1,
        limit: 10,
        countrycodes: 'ru',
        dedupe: 1,
      },
    });

    const cities = response.data
      .filter((place) => place.type === 'city' || place.type === 'town')
      .map((place) => place.display_name.split(',')[0]);

    return [...new Set(cities)];
  } catch (error) {
    console.error('Ошибка при получении городов:', error);
    return [];
  }
};
