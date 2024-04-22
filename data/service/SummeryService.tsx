import { Models } from '@/types/models';
import { API_URL } from '../config';

export const SummeryService = {
    async getCounts(): Promise<Models.Counts> {
        try {
          const response = await fetch(`${API_URL}/Summery/counts`, {
            method: 'GET', 
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch Counts');
          }
          const Counts: Models.Counts = await response.json();
          return Counts;
        } catch (error) {
          console.error('Error fetching Counts:', error);
          throw error;
        }
      }
}