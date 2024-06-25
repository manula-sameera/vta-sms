import { API_URL } from '../config';
import { Models } from '@/types/models';

export const JobPlacementService = {

    async getJobPlacement(traineeNo: string): Promise<Models.JobPlacement> {
        try {
            const response = await fetch(`${API_URL}/jobplacements/TraineeNo?TraineeNo=${traineeNo}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch Job Placement');
            }
            const jobPlacement: Models.JobPlacement = await response.json();
            return jobPlacement;
        } catch (error) {
            console.error('Error fetching Job Placement:', error);
            throw error;
        }
    },

    async addJobPlacement(jobPlacementData: Models.JobPlacement): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/jobplacements`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jobPlacementData),
            });
            return response;
        } catch (error) {
            console.error('Error adding Job Placement:', error);
            throw error;
        }
    },

    async addJobPlacements(jobPlacements: Models.JobPlacement[]): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/jobplacements/add-multiple`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jobPlacements),
            });
            return response;
        } catch (error) {
            console.error('Error adding Job Placements:', error);
            throw error;
        }
    },

    async updateJobPlacement(traineeNo: string, jobPlacementData: Models.JobPlacement): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/jobplacements?TraineeNo=${traineeNo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jobPlacementData),
            });
            return response;
        } catch (error) {
            console.error('Error updating Job Placement:', error);
            throw error;
        }
    },

    async deleteJobPlacement(traineeNo: string): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/jobplacements?TraineeNo=${traineeNo}`, {
                method: 'DELETE',
            });
            return response;
        } catch (error) {
            console.error('Error deleting Job Placement:', error);
            throw error;
        }
    },

    async deleteJobPlacements(traineeNos: string[]): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/jobplacements/delete-multiple`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(traineeNos),
            });
            return response;
        } catch (error) {
            console.error('Error deleting Job Placements:', error);
            throw error;
        }
    }

};
