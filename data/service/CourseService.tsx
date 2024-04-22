import { Models } from '@/types/models';
import { API_URL } from '../config';



export const CourseService = {
  async getCourses(): Promise<Models.Course[]> {
    try {
      const response = await fetch(`${API_URL}/Course`, {
        method: 'GET', // Set the request method
        // Optionally, you can set headers for authentication or other purposes
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers as needed
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const courses: Models.Course[] = await response.json();
      return courses;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  async addCourse(courseData: Models.Course): Promise<Response> {
    try {
      const response = await fetch(`${API_URL}/Course`, {
        method: 'POST', // Set the request method
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers as needed
        },
        body: JSON.stringify(courseData), // Set request body (for POST/PUT requests)
      });
  
        return response;
      
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  },

  async addCourses(courses: Models.Course[]): Promise<Response> {
    try {
      const response = await fetch(`${API_URL}/Course/add-multiple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courses),
      });
      return response;
    } catch (error) {
      console.error('Error adding courses:', error);
      throw error;
    }
  },

  async updateCourse(TraineeNo: string, courseData: Models.Course): Promise<Response> {
    try {
      const response = await fetch(`${API_URL}/Course/${TraineeNo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });
      return response;
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  },

  async deleteCourse(studentId: string): Promise<Response> {
    try {
      console.log('studentId:', studentId);
      const response = await fetch(`${API_URL}/Course/${studentId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  },

  async deleteCourses(courses: Models.Course[]): Promise<Response> {
    try {
      //const studentIds = courses.map(student => student.id);
      const response = await fetch(`${API_URL}/Course/delete-multiple`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courses),
      });
      return response;
    } catch (error) {
      console.error('Error deleting courses:', error);
      throw error;
    }
  }
};
