/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import { Dialog } from 'primereact/dialog';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
//import { CourseService } from '../../../../data/service/CourseService';
import { CourseService } from '@/data/service/CourseService';
import { Models } from '@/types/models';
import { Skeleton } from 'primereact/skeleton';
import { VirtualScrollerLoadingTemplateOptions } from 'primereact/virtualscroller';
import { parse } from 'csv-parse';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import { InputMaskChangeEvent } from "primereact/inputmask";
import { FormTarget, Nullable } from 'primereact/ts-helpers';

const Crud = () => {
    //Bookmark:empty model
    let emptyCourse: Models.Course = {
        courseID: '',
        courseName: '',
        courseInstructor: ''
    };

    const [Courses, setCourses] = useState<Models.Course[] | null>(null);
    const [CourseDialog, setCourseDialog] = useState(false);
    const [deleteCourseDialog, setDeleteCourseDialog] = useState(false);
    const [deleteCoursesDialog, setDeleteCoursesDialog] = useState(false);
    const [Course, setCourse] = useState<Models.Course>(emptyCourse);
    const [selectedCourses, setSelectedCourses] = useState<Models.Course[] | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    const [lazyLoading, setLazyLoading] = useState<boolean>(false);
    //combo box data
    const [batches, setCoursees] = useState<Models.Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [selectedGender, setselectedGender] = useState<string>('');
    const genders = [{ name: 'Male' }, { name: 'Female' }];

    //Bookmark: main fetch event
    useEffect(() => {
        CourseService.getCourses().then((data: Models.Course[]) => setCourses(data));
       // fetchCoursees();
    }, []);

    //Bookmark : combo box events
    //#region combo box events
    // useEffect(() => {
    //     setselectedGender(Course.gender);
    //     setSelectedCourse(Course.batch);
    // }, [Course]);

    // useEffect(() => {
    //     let _Course = { ...Course };
    //     _Course.gender = selectedGender;
    //     setCourse(_Course);
    // }, [selectedGender]);

    // useEffect(() => {
    //     let _Course = { ...Course };
    //     _Course.batch = selectedCourse;
    //     setCourse(_Course);
    // }, [selectedCourse]);

    // Function to fetch batches
    // const fetchCoursees = async () => {
    //     try {
    //         const batchesData = await CourseService.getCourses();
    //         setCoursees(batchesData);
    //         {
    //             console.log('batches' + JSON.stringify(batches));
    //         }
    //     } catch (error) {
    //         console.error('Error fetching batches:', error);
    //     }
    // };

    //#endregion
    const openNew = () => {
        setCourse(emptyCourse);
        setSubmitted(false);
        setCourseDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCourseDialog(false);
    };

    const hideDeleteCourseDialog = () => {
        setDeleteCourseDialog(false);
    };

    const hideDeleteCoursesDialog = () => {
        setDeleteCoursesDialog(false);
    };

    //Bookmark: Save Course
    const saveCourse = async () => {
        setSubmitted(true);

        if (Course.courseID) {
            let _Courses = [...(Courses as any)];
            let _Course = { ...Course };
            const index = findIndexById(Course.courseID);
            console.log('index ' + index);
            if (index != -1) {
                _Courses[index] = _Course;
                try {
                   // _Courses.push(_Course);
                    const response: Response = await CourseService.updateCourse(encodeURIComponent(Course.courseID), _Course);

                    // Check if the response status is 201 (Created)
                    if (response.status === 204) {
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Course Updated',
                            life: 3000
                        });
                    } else {
                        // If response status is not 201, show error message
                        throw new Error('Failed to Update Course. Status: ' + response.status);
                    }
                } catch (error) {
                    const errorMessage = (error as Error).message; // Type assertion
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error Updating Course: ' + errorMessage,
                        life: 3000
                    });
                }
            } else {
                //_Course.id = createId();
                //_Course.image = 'Course-placeholder.svg';
                try {
                    _Courses.push(_Course);
                    const response: Response = await CourseService.addCourse(_Course);

                    // Check if the response status is 201 (Created)
                    if (response.status === 201) {
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Course Created',
                            life: 3000
                        });
                    } else {
                        // If response status is not 201, show error message
                        throw new Error('Failed to create Course. Status: ' + response.status);
                    }
                } catch (error) {
                    const errorMessage = (error as Error).message; // Type assertion
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error creating Course: ' + errorMessage,
                        life: 3000
                    });
                }
            }
            setCourses(_Courses as any);
            setCourseDialog(false);
            setCourse(emptyCourse);
        }
    };

    //Bookmark: Edit Course
    const editCourse = async (b: Models.Course) => {
        setCourse({ ...b });
        setCourseDialog(true);
    };

    const confirmDeleteCourse = async (Course: Models.Course) => {
        setCourse(Course);
        setDeleteCourseDialog(true); 
    };
//Bookmark: Delete Course
    const deleteCourse = async () => {
        try {
            let _Courses = (Courses as any)?.filter((val: any) => val.courseID !== Course.courseID);
            setCourses(_Courses);
            setDeleteCourseDialog(false);
            const response: Response = await CourseService.deleteCourse(encodeURIComponent(Course.courseID));
            setCourse(emptyCourse);
            if (response.status === 204) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Course Deleted',
                    life: 3000
                });
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Failed',
                    detail: '' + response.status,
                    life: 3000
                });
            }
        } catch (error) {
            console.error('Error deleting Course:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error deleting Course',
                life: 3000
            });
        }
    };

    const findIndexById = (courseID: string) => {
        let index = -1;
        console.log(('Courses as any' + Courses) as any);
        for (let i = 0; i < (Courses as any)?.length; i++) {
            //TODO: change here select index
            if ((Courses as any)[i].courseID === courseID) {
                index = i;
                break;
            } else {
                index = -1;
            }
        }

        return index;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteCoursesDialog(true);
    };

    //Bookmark: Delete multiple Courses
    const deleteSelectedCourses = async () => {
        let _Courses = (Courses as any)?.filter((val: any) => !(selectedCourses as any)?.includes(val));
        setCourses(_Courses);
        setDeleteCoursesDialog(false);
        setSelectedCourses(null);
        try {
            //let _Courses = (Courses as any)?.filter((val: any) => val.id !== Course.id);
            //setCourses(_Courses);
            setDeleteCourseDialog(false);
            const response: Response = await CourseService.deleteCourses(selectedCourses as any);
            setSelectedCourses(null);
            if (response.status === 204) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Course Deleted',
                    life: 3000
                });
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Failed',
                    detail: '' + response.status,
                    life: 3000
                });
            }
        } catch (error) {
            console.error('Error deleting Course:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error deleting Course',
                life: 3000
            });
        }
    };
    //Bookmark: Input change event
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | InputNumberChangeEvent, name: string) => {
        
        try {
            let val: string | number  = '';
        if ('target' in e) {
            val = e.target.value;
        } else {
            val = e.value+'';
            console.log('value' + val);
        }
        let _Course = { ...Course };
        _Course[`${name}`] = val;
        setCourse(_Course);
        } catch (error) {
            console.error('Error updating Course:', error);
        }
    };

    const onCourseIDChange = (value:FormTarget<string>) => {
        let _Course = { ...Course };
        _Course.courseID = value.value+'';
        setCourse(_Course);
    }

    // Update this function to handle the global search input
    const handleGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };

        // @ts-ignore
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    // Bookmark: Handle file upload
    const handleFileUpload = async (event: FileUploadHandlerEvent) => {
        const file = event.files[0];
        const reader = new FileReader();
    
        reader.onload = async (e) => {
            try {
                // Parse the file content (assuming CSV format)
                const csvData = e.target?.result as string;
                console.log('csvData:', csvData);
                const CoursesData = await parseCSV(csvData); // Implement this function to parse CSV data
                console.log('CoursesData:', CoursesData);
                // Add the parsed Courses to the application
                const response = await CourseService.addCourses(CoursesData);
                if (response.status === 201) {
                    // Show success message
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Courses Uploaded Successfully',
                        life: 3000
                    });
                    // Refresh the Course data
                    CourseService.getCourses().then((data: Models.Course[]) => setCourses(data));
                } else {
                    // Show error message
                    throw new Error('Failed to upload Courses. Status: ' + response.status);
                }
            } catch (error) {
                // Handle error
                console.error('Error uploading Courses:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error Uploading Courses: ' + error,
                    life: 3000
                });
            }
        };
    
        // Read the file as text
        reader.readAsText(file);
    };

    const parseCSV = async (csvData: string): Promise<Models.Course[]> => {
        return new Promise((resolve, reject) => {
            parse(csvData, { columns: true }, (err, records) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(records as Models.Course[]);
                }
            });
        });
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedCourses || !(selectedCourses as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload
                    mode="basic"
                    accept=".csv" // Accept CSV and Excel files
                    maxFileSize={1000000}
                    chooseLabel="Import CSV/Excel" // Updated label
                    className="mr-2 inline-block"
                    customUpload
                    uploadHandler={handleFileUpload}
                    auto
                />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    //Bookmark: Table column Tempeletes
    //#region Table column Tempeletes
    const courseIDBodyTemplate = (rowData: Models.Course) => {
        return (
            <>
                <span className="p-column-title">courseID</span>
                {rowData.courseID}
            </>
        );
    };

    const courseNameBodyTemplate = (rowData: Models.Course) => {
        return (
            <>
                <span className="p-column-title">courseName</span>
                {rowData.courseName}
            </>
        );
    };

    const courseInstructorBodyTemplate = (rowData: Models.Course) => {
        return (
            <>
                <span className="p-column-title">courseInstructor</span>
                {rowData.courseInstructor}
            </>
        );
    };


    const actionBodyTemplate = (rowData: Models.Course) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editCourse(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteCourse(rowData)} />
            </>
        );
    };
    //#endregion

    const header = Courses && (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            {/* //Bookmark: Table header */}
            <h5 className="m-0">Manage Courses</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={globalFilterValue} onInput={handleGlobalFilterChange} placeholder="Search..." />
            </span>
        </div>
    );

    const CourseDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveCourse} />
        </>
    );
    const deleteCourseDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteCourseDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteCourse} />
        </>
    );
    const deleteCoursesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteCoursesDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedCourses} />
        </>
    );

    const loadingTemplate = (options: VirtualScrollerLoadingTemplateOptions) => {
        return (
            <div className="flex align-items-center" style={{ height: '17px', flexGrow: '1', overflow: 'hidden' }}>
                <Skeleton width={options.cellEven ? (options.field === 'year' ? '30%' : '40%') : '60%'} height="1rem" />
            </div>
        );
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        virtualScrollerOptions={{ lazy: true, itemSize: 46, delay: 200, showLoader: true, loading: lazyLoading, loadingTemplate }}
                        filters={filters}
                        filterDisplay="row"
                        ref={dt}
                        value={Courses}
                        selection={selectedCourses}
                        onSelectionChange={(e) => setSelectedCourses(e.value as any)}
                        dataKey="courseID"
                        paginator
                        rows={20}
                        rowsPerPageOptions={[25, 50, 100]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Courses"
                        globalFilterFields={['courseID', 'courseName', 'courseInstructor']}
                        emptyMessage="No Courses found."
                        header={header}
                    >
                        {/* Bookmark:Table Columns */}
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="courseID" header="courseID" sortable body={courseIDBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="courseName" header="courseName" sortable body={courseNameBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="courseInstructor" header="courseInstructor" sortable body={courseInstructorBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={CourseDialog} style={{ width: '450px' }} header="Course Details" modal className="p-fluid" footer={CourseDialogFooter} onHide={hideDialog}>
                        {/* Bookmark: Input Elements */}
                        {/* #region Input Elements */}
                        <div className="field">
                            <label htmlFor="courseID">CourseID</label>
                            <InputText
                                id="courseID"
                                value={Course.courseID}
                                onChange={(e) => onInputChange(e,'courseID')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !Course.courseID
                                })}
                            />
                            {submitted && !Course.courseID && <small className="p-invalid">courseID is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="courseName">courseName</label>
                            <InputText
                                id="courseName"
                                value={Course.courseName}
                                onChange={(e) => onInputChange(e, 'courseName')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !Course.courseName
                                })}
                            />
                            {submitted && !Course.courseName && <small className="p-invalid">courseName is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="courseInstructor">courseInstructor</label>
                            <InputText
                                id="courseInstructor"
                                value={Course.courseInstructor}
                                onChange={(e) => onInputChange(e, 'courseInstructor')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !Course.courseInstructor
                                })}
                            />
                            {submitted && !Course.courseInstructor && <small className="p-invalid">courseInstructor is required.</small>}
                        </div>
                        {/* #endregion */}
                    </Dialog>

                    <Dialog visible={deleteCourseDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteCourseDialogFooter} onHide={hideDeleteCourseDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {Course && (
                                <span>
                                    {/* TODO:change here delete message */}
                                    Are you sure you want to delete <b>{Course.courseName}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteCoursesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteCoursesDialogFooter} onHide={hideDeleteCoursesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {selectedCourses && <span>Are you sure you want to delete the {selectedCourses.length} selected Courses?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;