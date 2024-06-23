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
      },

      async getPendingAmounts(): Promise<Models.PendingAmounts[]> {
        try {
          const response = await fetch(`${API_URL}/Summery/pending_amounts`, {
            method: 'GET', 
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch PendingAmounts');
          }
          const PendingAmounts: Models.PendingAmounts[] = await response.json();
          return PendingAmounts;
        } catch (error) {
          console.error('Error fetching PendingAmounts:', error);
          throw error;
        }
      },
      async getOrganizationStudentsCount(): Promise<Models.OrganizationStudentsCount[]> {
        try {
          const response = await fetch(`${API_URL}/Summery/OrganizationStudentsCount`, {
            method: 'GET', 
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch OrganizationStudentsCount');
          }
          const OrganizationStudentsCount: Models.OrganizationStudentsCount[] = await response.json();
          return OrganizationStudentsCount;
        } catch (error) {
          console.error('Error fetching OrganizationStudentsCount:', error);
          throw error;
        }
      },

      async getStudentSummary(studentID : string): Promise<Models.Trainee[]> {
        try {
          const response = await fetch(`${API_URL}/Summery/StudentSummery/${encodeURIComponent(studentID)}`, {
            method: 'GET', 
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch Trainee');
          }
          const Trainee: Models.Trainee[] = await response.json();
          return Trainee;
        } catch (error) {
          console.error('Error fetching Trainee:', error);
          throw error;
        }

      }
}