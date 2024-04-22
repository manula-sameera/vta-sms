import { Models } from '@/types/models';
import { API_URL } from '../config';

export const OrganizationService = {

    async getOrganizations(): Promise<Models.Organization[]> {
        try {
          const response = await fetch(`${API_URL}/Organizations`, {
            method: 'GET', 
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch Organizations');
          }
          const Organizations: Models.Organization[] = await response.json();
          return Organizations;
        } catch (error) {
          console.error('Error fetching Organizations:', error);
          throw error;
        }
      },

      async addOrganization(OrganizationData: Models.Organization): Promise<Response> {
        try {
          const response = await fetch(`${API_URL}/Organizations`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(OrganizationData),
          });
      
            return response;
          
        } catch (error) {
          console.error('Error adding Organization:', error);
          throw error;
        }
      },
      async addOrganizations(Organizations: Models.Organization[]): Promise<Response> {
        try {
          const response = await fetch(`${API_URL}/Organizations/add-multiple`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(Organizations),
          });
          return response;
        } catch (error) {
          console.error('Error adding Organizations:', error);
          throw error;
        }
      },
    
      async updateOrganization(TraineeNo: string, OrganizationData: Models.Organization): Promise<Response> {
        try {
          const response = await fetch(`${API_URL}/Organizations/${TraineeNo}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(OrganizationData),
          });
          return response;
        } catch (error) {
          console.error('Error updating Organization:', error);
          throw error;
        }
      },
    
      async deleteOrganization(OrganizationId: string): Promise<Response> {
        try {
          const response = await fetch(`${API_URL}/Organizations/${OrganizationId}`, {
            method: 'DELETE',
          });
          return response;
        } catch (error) {
          console.error('Error deleting Organization:', error);
          throw error;
        }
      },
    
      async deleteOrganizations(Organizations: Models.Organization[]): Promise<Response> {
        try {
          //const OrganizationIds = Organizations.map(Organization => Organization.id);
          const response = await fetch(`${API_URL}/Organizations/delete-multiple`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(Organizations),
          });
          return response;
        } catch (error) {
          console.error('Error deleting Organizations:', error);
          throw error;
        }
      }

};