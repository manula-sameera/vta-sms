import { Models } from '@/types/models';
import { API_URL } from '../config';

export const BatchService = {

    async getBatchs(): Promise<Models.Batch[]> {
        try {
          const response = await fetch(`${API_URL}/Batch`, {
            method: 'GET', // Set the request method
            // Optionally, you can set headers for authentication or other purposes
            headers: {
              'Content-Type': 'application/json',
              // Add any other headers as needed
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch Batches');
          }
          const Batches: Models.Batch[] = await response.json();
          return Batches;
        } catch (error) {
          console.error('Error fetching Batches:', error);
          throw error;
        }
      }

};