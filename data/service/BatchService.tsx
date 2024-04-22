import { Models } from '@/types/models';
import { API_URL } from '../config';

export const BatchService = {

    async getBatchs(): Promise<Models.Batch[]> {
        try {
          const response = await fetch(`${API_URL}/Batch`, {
            method: 'GET', 
            headers: {
              'Content-Type': 'application/json',
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
      },

      async addBatch(BatchData: Models.Batch): Promise<Response> {
        try {
          const response = await fetch(`${API_URL}/Batch`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(BatchData),
          });
      
            return response;
          
        } catch (error) {
          console.error('Error adding Batch:', error);
          throw error;
        }
      },
      async addBatchs(Batchs: Models.Batch[]): Promise<Response> {
        try {
          const response = await fetch(`${API_URL}/Batch/add-multiple`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(Batchs),
          });
          return response;
        } catch (error) {
          console.error('Error adding Batchs:', error);
          throw error;
        }
      },
    
      async updateBatch(TraineeNo: string, BatchData: Models.Batch): Promise<Response> {
        try {
          const response = await fetch(`${API_URL}/Batch/${TraineeNo}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(BatchData),
          });
          return response;
        } catch (error) {
          console.error('Error updating Batch:', error);
          throw error;
        }
      },
    
      async deleteBatch(BatchId: string): Promise<Response> {
        try {
          const response = await fetch(`${API_URL}/Batch/${BatchId}`, {
            method: 'DELETE',
          });
          return response;
        } catch (error) {
          console.error('Error deleting Batch:', error);
          throw error;
        }
      },
    
      async deleteBatchs(Batchs: Models.Batch[]): Promise<Response> {
        try {
          //const BatchIds = Batchs.map(Batch => Batch.id);
          const response = await fetch(`${API_URL}/Batch/delete-multiple`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(Batchs),
          });
          return response;
        } catch (error) {
          console.error('Error deleting Batchs:', error);
          throw error;
        }
      }

};