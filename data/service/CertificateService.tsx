import { API_URL } from '../config';
import { Models } from '@/types/models';

export const CertificateService = {

    async getCertificate(traineeNo: string): Promise<Models.Certificate> {
        try {
            const response = await fetch(`${API_URL}/certificates/${traineeNo}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch Certificate');
            }
            const certificate: Models.Certificate = await response.json();
            return certificate;
        } catch (error) {
            console.error('Error fetching Certificate:', error);
            throw error;
        }
    },

    async addCertificate(certificateData: Models.Certificate): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/certificates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(certificateData),
            });
            return response;
        } catch (error) {
            console.error('Error adding Certificate:', error);
            throw error;
        }
    },

    async addCertificates(certificates: Models.Certificate[]): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/certificates/add-multiple`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(certificates),
            });
            return response;
        } catch (error) {
            console.error('Error adding Certificates:', error);
            throw error;
        }
    },

    async updateCertificate(traineeNo: string, certificateData: Models.Certificate): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/certificates/${traineeNo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(certificateData),
            });
            return response;
        } catch (error) {
            console.error('Error updating Certificate:', error);
            throw error;
        }
    },

    async deleteCertificate(traineeNo: string): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/certificates/${traineeNo}`, {
                method: 'DELETE',
            });
            return response;
        } catch (error) {
            console.error('Error deleting Certificate:', error);
            throw error;
        }
    },

    async deleteCertificates(traineeNos: string[]): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/certificates/delete-multiple`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(traineeNos),
            });
            return response;
        } catch (error) {
            console.error('Error deleting Certificates:', error);
            throw error;
        }
    }

};
