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

    interface Course {
        courseID: string;
        courseName: string;
        courseInstructor: string;
        [key: string]: string | string[] | number;
    }

    interface Organization {
        organizationID: string;
        organizationName: string;
        address: string;
        [key: string]: string | string[] | number;
    }

    interface Counts {
        stuDetailsCount: number;
        coursesCount: number;
        organizationsCount: number;

        [key: string]: string | string[] | number;
    }

    interface PendingAmounts {
        traineeNo: string;
        nameWithInitials: string;
        courseName: string;
        batchID: string;
        pendingAmount: number;
    }

    interface OrganizationStudentsCount {
        organizationName: string;
        students: number;
    }

    interface Payment {
        traineeNo: string;
        paymentID: string;
        amount: number;
        pDate: Date;
        [key: string]: string | string[] | number | Date;
    }

    interface Attendance {
        traineeNo: string;
        totalAtt: number;
    }

    interface Instructor {
        epf: string;
        nameWithInitials: string;
        address: string;
        nic: string;
        gender: string;
        mob: string;
        fingerPrintID: string;
    }

    interface Dropout {
        traineeNo: string;
        reason: string;
        lastAttendedDate: Date;
        dropoutFiledDate: Date;
    }

    interface Certificate {
        traineeNo: string;
        certificateNo: string;
        certificateDate: Date;
        NVQLevel: string;
    }

    interface HigherEducation {
        traineeNo: string;
        instituteName: string;
        qualificationLevel: string;
        remarks: string;
    }

    interface JobPlacement {
        traineeNo: string;
        jobTitle: string;
        workplaceName: string;
        workplaceAddress: string;
        startDate: Date;
    }

    interface PracticalExamResults {
        traineeNo: string;
        pExamDate: Date;
        pExamModule: string;
        pExamModuleResult: string;
    }

    interface TheoryExamResults {
        traineeNo: string;
        tExamDate: Date;
        tExamResult: string;
    }

    interface Trainee {
        traineeNo: string;
        nameWithInitials: string;
        address: string;
        nic: string;
        gender: string;
        mob: string;
        batch: string;
        fingerPrintID: string;
        courses: SCourse[];
        payments: SPayment[];
        attendance: number;
        practicalExams: SPracticalExam[];
        theoryExams: STheoryExam[];
        ojtPlacements: SOJTPlacement[];
        jobPlacements: SJobPlacement[];
        higherEducations: SHigherEducation[];
        dropouts: SDropout[];
    }
    
    interface SCourse {
        courseID: string;
        courseName: string;
        courseInstructor: string;
    }

    interface SPayment {
        paymentID: string;
        paymentAmount: string;
        paymentDate: string;
    }


    interface SPracticalExam {
        practicalExamDate: string;
        practicalExamModule: string;
        practicalExamResult: string;
    }


    interface STheoryExam {
        theoryExamDate: string;
        theoryExamResult: string;
    }

    interface SOJTPlacement {
        ojtJobTitle: string;
        ojtWorkplaceName: string;
        ojtWorkplaceAddress: string;
        ojtoicName: string;
        ojtStartDate: string;
        ojtEndDate: string;
    }


    interface SJobPlacement {
        jobPlacementTitle: string;
        jobPlacementWorkplaceName: string;
        jobPlacementWorkplaceAddress: string;
        jobPlacementStartDate: string;
    }


    interface SHigherEducation {
        higherEducationInstitute: string;
        higherEducationLevel: string;
        higherEducationRemarks: string;
    }


    interface SDropout {
        dropoutReason: string;
        dropoutLastAttendedDate: string;
        dropoutFiledDate: string;
    }
    
}
