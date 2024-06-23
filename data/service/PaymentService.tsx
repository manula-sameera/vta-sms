import { Models } from '@/types/models';
import { API_URL } from '../config';

export const PaymentService = {

    async getPayments(): Promise<Models.Payment[]> {
        try {
            const response = await fetch(`${API_URL}/payments`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch Payment');
            }
            const payments: Models.Payment[] = await response.json();
            return payments;
        } catch (error) {
            console.error('Error fetching Payment:', error);
            throw error;
        }
    },

    async addPayment(paymentData: Models.Payment): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/payments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });
            return response;
        } catch (error) {
            console.error('Error adding Payment:', error);
            throw error;
        }
    },

    async addPayments(payments: Models.Payment[]): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/payments/add-multiple`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payments),
            });
            return response;
        } catch (error) {
            console.error('Error adding Payment:', error);
            throw error;
        }
    },

    async updatePayment(paymentID: string, paymentData: Models.Payment): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/payments/${paymentID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });
            return response;
        } catch (error) {
            console.error('Error updating Payment:', error);
            throw error;
        }
    },

    async deletePayment(paymentID: string): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/payments/${paymentID}`, {
                method: 'DELETE',
            });
            return response;
        } catch (error) {
            console.error('Error deleting Payment:', error);
            throw error;
        }
    },

    async deletePayments(paymentIDs: string[]): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/payments/delete-multiple`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentIDs),
            });
            return response;
        } catch (error) {
            console.error('Error deleting Payment:', error);
            throw error;
        }
    }

};

