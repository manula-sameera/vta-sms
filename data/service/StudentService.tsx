import { Models } from '@/types/models';
import { API_URL } from '../config';



export const StudentService = {
  async getStudents(): Promise<Models.Student[]> {
    try {
      const response = await fetch(`${API_URL}/StudentDetails`, {
        method: 'GET', // Set the request method
        // Optionally, you can set headers for authentication or other purposes
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers as needed
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const students: Models.Student[] = await response.json();
      return students;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  async addStudent(studentData: Models.Student): Promise<Response> {
    try {
      const response = await fetch(`${API_URL}/StudentDetails`, {
        method: 'POST', // Set the request method
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers as needed
        },
        body: JSON.stringify(studentData), // Set request body (for POST/PUT requests)
      });
  
        return response;
      
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  },

  async addStudnets(students: Models.Student[]): Promise<Response> {
    try {
      const response = await fetch(`${API_URL}/StudentDetails/add-multiple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(students),
      });
      return response;
    } catch (error) {
      console.error('Error adding students:', error);
      throw error;
    }
  },

  async updateStudent(TraineeNo: string, studentData: Models.Student): Promise<Response> {
    try {
      const response = await fetch(`${API_URL}/StudentDetails/${TraineeNo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });
      return response;
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  },

  async deleteStudent(studentId: string): Promise<Response> {
    try {
      console.log('studentId:', studentId);
      const response = await fetch(`${API_URL}/StudentDetails/${studentId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  },

  async deleteStudents(students: Models.Student[]): Promise<Response> {
    try {
      //const studentIds = students.map(student => student.id);
      const response = await fetch(`${API_URL}/StudentDetails/delete-multiple`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(students),
      });
      return response;
    } catch (error) {
      console.error('Error deleting students:', error);
      throw error;
    }
  }
};
