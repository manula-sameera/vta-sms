import { API_URL } from '../config';
import { Models } from '@/types/models';

export const PracticalExamResultsService = {

    async getPracticalExamResult(traineeNo: string): Promise<Models.PracticalExamResults> {
        try {
            const response = await fetch(`${API_URL}/practicalexamresults/${traineeNo}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch Practical Exam Result');
            }
            const practicalExamResult: Models.PracticalExamResults = await response.json();
            return practicalExamResult;
        } catch (error) {
            console.error('Error fetching Practical Exam Result:', error);
            throw error;
        }
    },

    async addPracticalExamResult(practicalExamResultData: Models.PracticalExamResults): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/practicalexamresults`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(practicalExamResultData),
            });
            return response;
        } catch (error) {
            console.error('Error adding Practical Exam Result:', error);
            throw error;
        }
    },

    async addPracticalExamResults(practicalExamResults: Models.PracticalExamResults[]): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/practicalexamresults/add-multiple`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(practicalExamResults),
            });
            return response;
        } catch (error) {
            console.error('Error adding Practical Exam Results:', error);
            throw error;
        }
    },

    async updatePracticalExamResult(traineeNo: string, practicalExamResultData: Models.PracticalExamResults): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/practicalexamresults/${traineeNo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(practicalExamResultData),
            });
            return response;
        } catch (error) {
            console.error('Error updating Practical Exam Result:', error);
            throw error;
        }
    },

    async deletePracticalExamResult(traineeNo: string): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/practicalexamresults/${traineeNo}`, {
                method: 'DELETE',
            });
            return response;
        } catch (error) {
            console.error('Error deleting Practical Exam Result:', error);
            throw error;
        }
    },

    async deletePracticalExamResults(traineeNos: string[]): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/practicalexamresults/delete-multiple`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(traineeNos),
            });
            return response;
        } catch (error) {
            console.error('Error deleting Practical Exam Results:', error);
            throw error;
        }
    }

};
