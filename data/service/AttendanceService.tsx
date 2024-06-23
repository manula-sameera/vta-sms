import { API_URL } from '../config';
import { Models } from '@/types/models';

export const AttendanceService = {

    async getAttendance(traineeNo: string): Promise<Models.Attendance> {
        try {
            const response = await fetch(`${API_URL}/attendance/${traineeNo}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch Attendance');
            }
            const attendance: Models.Attendance = await response.json();
            return attendance;
        } catch (error) {
            console.error('Error fetching Attendance:', error);
            throw error;
        }
    },

    async addAttendance(attendanceData: Models.Attendance): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/attendance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(attendanceData),
            });
            return response;
        } catch (error) {
            console.error('Error adding Attendance:', error);
            throw error;
        }
    },

    async addAttendances(attendances: Models.Attendance[]): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/attendance/add-multiple`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(attendances),
            });
            return response;
        } catch (error) {
            console.error('Error adding Attendances:', error);
            throw error;
        }
    },

    async updateAttendance(traineeNo: string, attendanceData: Models.Attendance): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/attendance/${traineeNo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(attendanceData),
            });
            return response;
        } catch (error) {
            console.error('Error updating Attendance:', error);
            throw error;
        }
    },

    async deleteAttendance(traineeNo: string): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/attendance/${traineeNo}`, {
                method: 'DELETE',
            });
            return response;
        } catch (error) {
            console.error('Error deleting Attendance:', error);
            throw error;
        }
    },

    async deleteAttendances(traineeNos: string[]): Promise<Response> {
        try {
            const response = await fetch(`${API_URL}/attendance/delete-multiple`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(traineeNos),
            });
            return response;
        } catch (error) {
            console.error('Error deleting Attendances:', error);
            throw error;
        }
    }

};
