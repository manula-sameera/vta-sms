import { API_URL } from '../config';
import { Models } from '@/types/models';
//TODO: Complete TheoryExamResult services
export const TheoryExamResultsService = {

    async getTheoryExamResult(traineeNo: string): Promise<Models.TheoryExamResults> {
        try {
            const response = await fetch(`${API_URL}/theoryexamresults/${traineeNo}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch Theory Exam Result');
            }
            const theoryExamResult: Models.TheoryExamResults = await response.json();
            return theoryExamResult;
        } catch (error) {
            console.error('Error fetching Theory Exam Result:', error);
            throw error;
        }
    },

    async addTheoryExamResult(theoryExamResultData: Models.TheoryExamResults): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/theoryexamresults`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(theoryExamResultData),
            });
            return response;
        } catch (error) {
            console.error('Error adding Theory Exam Result:', error);
            throw error;
        }
    },

    async addTheoryExamResults(theoryExamResults: Models.TheoryExamResults[]): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/theoryexamresults/add-multiple`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(theoryExamResults),
            });
            return response;
        } catch (error) {
            console.error('Error adding Theory Exam Results:', error);
            throw error;
        }
    },

    async updateTheoryExamResult(traineeNo: string, theoryExamResultData: Models.TheoryExamResults): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/theoryexamresults/${traineeNo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(theoryExamResultData),
            });
            return response;
        } catch (error) {
            console.error('Error updating Theory Exam Result:', error);
            throw error;
        }
    },

    async deleteTheoryExamResult(traineeNo: string): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/theoryexamresults/${traineeNo}`, {
                method: 'DELETE',
            });
            return response;
        } catch (error) {
            console.error('Error deleting Theory Exam Result:', error);
            throw error;
        }
    },

    async deleteTheoryExamResults(traineeNos: string[]): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/theoryexamresults/delete-multiple`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(traineeNos),
            });
            return response;
        } catch (error) {
            console.error('Error deleting Theory Exam Results:', error);
            throw error;
        }
    }

};
