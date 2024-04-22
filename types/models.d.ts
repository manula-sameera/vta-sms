/* FullCalendar Types */
import { EventApi, EventInput } from '@fullcalendar/core';

/* Chart.js Types */
import { ChartData, ChartOptions } from 'chart.js';

declare namespace Models {
    interface Student {
        traineeNo: string;
        nameWithInitials?: string;
        address?: string;
        nic: string;
        gender: string;
        mob: string;
        batch: string;
        fingerPrintID: string;
        [key: string]: string | string[] | number;
    }

    interface Batch {
        batchID: string;
        batch: string;
        bYear: number;
        organizationID: string;
        bAmount: number;
        courseID: string;
        heldDays: string;
        bTarget: string;
        [key: string]: string | string[] | number;
    }

    interface Course{
        courseID :	string;
        courseName:	string;
        courseInstructor : string;  
        [key: string]: string | string[] | number;
    }

    interface Organization {
        organizationID: string;
        organizationName: string;
        address: string;
        [key: string]: string | string[] | number;
    }

    interface Counts{
        stuDetailsCount: number,
        coursesCount: number,
        organizationsCount: number

        [key: string]: string | string[] | number;
    }
}
