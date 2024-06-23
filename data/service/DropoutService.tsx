import { API_URL } from '../config';
import { Models } from '@/types/models';

export const DropoutService = {

    async getDropout(traineeNo: string): Promise<Models.Dropout> {
        try {
            const response = await fetch(`${API_URL}/dropouts/${traineeNo}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch Dropout');
            }
            const dropout: Models.Dropout = await response.json();
            return dropout;
        } catch (error) {
            console.error('Error fetching Dropout:', error);
            throw error;
        }
    },

    async addDropout(dropoutData: Models.Dropout): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/dropouts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dropoutData),
            });
            return response;
        } catch (error) {
            console.error('Error adding Dropout:', error);
            throw error;
        }
    },

    async addDropouts(dropouts: Models.Dropout[]): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/dropouts/add-multiple`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dropouts),
            });
            return response;
        } catch (error) {
            console.error('Error adding Dropouts:', error);
            throw error;
        }
    },

    async updateDropout(traineeNo: string, dropoutData: Models.Dropout): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/dropouts/${traineeNo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dropoutData),
            });
            return response;
        } catch (error) {
            console.error('Error updating Dropout:', error);
            throw error;
        }
    },

    async deleteDropout(traineeNo: string): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/dropouts/${traineeNo}`, {
                method: 'DELETE',
            });
            return response;
        } catch (error) {
            console.error('Error deleting Dropout:', error);
            throw error;
        }
    },

    async deleteDropouts(traineeNos: string[]): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/dropouts/delete-multiple`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(traineeNos),
            });
            return response;
        } catch (error) {
            console.error('Error deleting Dropouts:', error);
            throw error;
        }
    }

};
