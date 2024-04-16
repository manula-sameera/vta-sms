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
        BatchID: string;
        Batch: string;
        BYear: Number;
        OrganizationID: string;
        BAmount: Number;
        CourseID: string;
        HeldDays: string;
        BTarget: string;
        [key: string]: string | string[] | number;
    }
}
