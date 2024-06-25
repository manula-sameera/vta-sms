import { API_URL } from '../config';
import { Models } from '@/types/models';

export const InstructorService = {

    async getInstructor(epf: string): Promise<Models.Instructor> {
        try {
            const response = await fetch(`${API_URL}/instructor/EPF?EPF=${epf}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch Instructor');
            }
            const instructor: Models.Instructor = await response.json();
            return instructor;
        } catch (error) {
            console.error('Error fetching Instructor:', error);
            throw error;
        }
    },

    async addInstructor(instructorData: Models.Instructor): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/instructor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(instructorData),
            });
            return response;
        } catch (error) {
            console.error('Error adding Instructor:', error);
            throw error;
        }
    },

    async addInstructors(instructors: Models.Instructor[]): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/instructor/add-multiple`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(instructors),
            });
            return response;
        } catch (error) {
            console.error('Error adding Instructors:', error);
            throw error;
        }
    },

    async updateInstructor(epf: string, instructorData: Models.Instructor): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/instructor?EPF=${epf}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(instructorData),
            });
            return response;
        } catch (error) {
            console.error('Error updating Instructor:', error);
            throw error;
        }
    },

    async deleteInstructor(epf: string): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/instructor?EPF=${epf}`, {
                method: 'DELETE',
            });
            return response;
        } catch (error) {
            console.error('Error deleting Instructor:', error);
            throw error;
        }
    },

    async deleteInstructors(epfs: string[]): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/instructor/delete-multiple`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(epfs),
            });
            return response;
        } catch (error) {
            console.error('Error deleting Instructors:', error);
            throw error;
        }
    }

};
