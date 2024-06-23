import { API_URL } from '../config';
import { Models } from '@/types/models';

export const HigherEducationsService = {

    async getHigherEducation(traineeNo: string): Promise<Models.HigherEducation> {
        try {
            const response = await fetch(`${API_URL}/highereducations/${traineeNo}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch Higher Education');
            }
            const higherEducation: Models.HigherEducation = await response.json();
            return higherEducation;
        } catch (error) {
            console.error('Error fetching Higher Education:', error);
            throw error;
        }
    },

    async addHigherEducation(higherEducationData: Models.HigherEducation): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/highereducations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(higherEducationData),
            });
            return response;
        } catch (error) {
            console.error('Error adding Higher Education:', error);
            throw error;
        }
    },

    async addHigherEducations(higherEducations: Models.HigherEducation[]): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/highereducations/add-multiple`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(higherEducations),
            });
            return response;
        } catch (error) {
            console.error('Error adding Higher Educations:', error);
            throw error;
        }
    },

    async updateHigherEducation(traineeNo: string, higherEducationData: Models.HigherEducation): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/highereducations/${traineeNo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(higherEducationData),
            });
            return response;
        } catch (error) {
            console.error('Error updating Higher Education:', error);
            throw error;
        }
    },

    async deleteHigherEducation(traineeNo: string): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/highereducations/${traineeNo}`, {
                method: 'DELETE',
            });
            return response;
        } catch (error) {
            console.error('Error deleting Higher Education:', error);
            throw error;
        }
    },

    async deleteHigherEducations(traineeNos: string[]): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/highereducations/delete-multiple`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(traineeNos),
            });
            return response;
        } catch (error) {
            console.error('Error deleting Higher Educations:', error);
            throw error;
        }
    }

};
