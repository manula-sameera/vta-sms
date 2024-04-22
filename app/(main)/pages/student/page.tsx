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
import { StudentService } from '../../../../data/service/StudentService';
import { BatchService } from '@/data/service/BatchService';
import { Models } from '@/types/models';
import { FileUploadUploadEvent } from 'primereact/fileupload';
import { Skeleton } from 'primereact/skeleton';
import { VirtualScrollerLoadingTemplateOptions } from 'primereact/virtualscroller';
import { Dropdown } from 'primereact/dropdown';
import { parse } from 'csv-parse';

const Crud = () => {
    //Bookmark:empty model
    let emptyStudent: Models.Student = {
        traineeNo: '',
        nameWithInitials: '',
        address: '',
        nic: '',
        gender: '',
        mob: '',
        batch: '',
        fingerPrintID: ''
    };

    const [students, setStudents] = useState<Models.Student[] | null>(null);
    const [studentDialog, setStudentDialog] = useState(false);
    const [deleteStudentDialog, setDeleteStudentDialog] = useState(false);
    const [deleteStudentsDialog, setDeleteStudentsDialog] = useState(false);
    const [student, setStudent] = useState<Models.Student>(emptyStudent);
    const [selectedStudents, setSelectedStudents] = useState<Models.Student[] | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    const [lazyLoading, setLazyLoading] = useState<boolean>(false);
    //combo box data
    const [batches, setBatches] = useState<Models.Batch[]>([]);
    const [selectedBatch, setSelectedBatch] = useState<string>('');
    const [selectedGender, setselectedGender] = useState<string>('');
    const genders = [{ name: 'Male' }, { name: 'Female' }];

    //Bookmark: main fetch event
    useEffect(() => {
        StudentService.getStudents().then((data: Models.Student[]) => setStudents(data));
        fetchBatches();
    }, []);

    //Bookmark : combo box events
    //#region combo box events
    useEffect(() => {
        setselectedGender(student.gender);
        setSelectedBatch(student.batch);
    }, [student]);

    useEffect(() => {
        let _student = { ...student };
        _student.gender = selectedGender;
        setStudent(_student);
    }, [selectedGender]);

    useEffect(() => {
        let _student = { ...student };
        _student.batch = selectedBatch;
        setStudent(_student);
    }, [selectedBatch]);

    // Function to fetch batches
    const fetchBatches = async () => {
        try {
            const batchesData = await BatchService.getBatchs();
            setBatches(batchesData);
            {
                console.log('batches' + JSON.stringify(batches));
            }
        } catch (error) {
            console.error('Error fetching batches:', error);
        }
    };

    //#endregion
    const openNew = () => {
        setStudent(emptyStudent);
        setSubmitted(false);
        setStudentDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setStudentDialog(false);
    };

    const hideDeleteStudentDialog = () => {
        setDeleteStudentDialog(false);
    };

    const hideDeleteStudentsDialog = () => {
        setDeleteStudentsDialog(false);
    };

    //Bookmark: Save student
    const saveStudent = async () => {
        setSubmitted(true);

        if (student.traineeNo) {
            let _students = [...(students as any)];
            let _student = { ...student };
            const index = findIndexById(student.traineeNo);
            console.log('index ' + index);
            if (index != -1) {
                _students[index] = _student;
                try {
                    //_students.push(_student);
                    const response: Response = await StudentService.updateStudent(encodeURIComponent(student.traineeNo), _student);

                    // Check if the response status is 201 (Created)
                    if (response.status === 204) {
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Student Updated',
                            life: 3000
                        });
                    } else {
                        // If response status is not 201, show error message
                        throw new Error('Failed to Update student. Status: ' + response.status);
                    }
                } catch (error) {
                    const errorMessage = (error as Error).message; // Type assertion
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error Updating student: ' + errorMessage,
                        life: 3000
                    });
                }
            } else {
                //_student.id = createId();
                //_student.image = 'student-placeholder.svg';
                try {
                    _students.push(_student);
                    // StudentService.addStudent(_student);
                    const response: Response = await StudentService.addStudent(_student);

                    // Check if the response status is 201 (Created)
                    if (response.status === 201) {
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Student Created',
                            life: 3000
                        });
                    } else {
                        // If response status is not 201, show error message
                        throw new Error('Failed to create student. Status: ' + response.status);
                    }
                } catch (error) {
                    const errorMessage = (error as Error).message; // Type assertion
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error creating student: ' + errorMessage,
                        life: 3000
                    });
                }
            }
            setStudents(_students as any);
            setStudentDialog(false);
            setStudent(emptyStudent);
        }
    };

    //Bookmark: Edit student
    const editStudent = async (student: Models.Student) => {
        
        setStudent({ ...student });

        setStudentDialog(true);
    };

    const confirmDeleteStudent = async (student: Models.Student) => {
        setStudent(student);
        setDeleteStudentDialog(true); 
    };
//Bookmark: Delete student
    const deleteStudent = async () => {
        try {
            let _students = (students as any)?.filter((val: any) => val.traineeNo !== student.traineeNo);
            setStudents(_students);
            setDeleteStudentDialog(false);
            const response: Response = await StudentService.deleteStudent(encodeURIComponent(student.traineeNo));
            setStudent(emptyStudent);
            if (response.status === 204) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Student Deleted',
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
            console.error('Error deleting student:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error deleting student',
                life: 3000
            });
        }
    };

    const findIndexById = (TraineeNo: string) => {
        let index = -1;
        console.log(('students as any' + students) as any);
        for (let i = 0; i < (students as any)?.length; i++) {
            //TODO: change here select index
            if ((students as any)[i].traineeNo === TraineeNo) {
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
        setDeleteStudentsDialog(true);
    };

    //Bookmark: Delete multiple students
    const deleteSelectedStudents = async () => {
        let _students = (students as any)?.filter((val: any) => !(selectedStudents as any)?.includes(val));
        setStudents(_students);
        setDeleteStudentsDialog(false);
        setSelectedStudents(null);
        try {
            //let _students = (students as any)?.filter((val: any) => val.id !== student.id);
            //setStudents(_students);
            setDeleteStudentDialog(false);
            const response: Response = await StudentService.deleteStudents(selectedStudents as any);
            setSelectedStudents(null);
            if (response.status === 204) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Student Deleted',
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
            console.error('Error deleting student:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error deleting student',
                life: 3000
            });
        }
    };
    //Bookmark: Input change event
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _student = { ...student };
        _student[`${name}`] = val;
        setStudent(_student);
    };

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
                const studentsData = await parseCSV(csvData); // Implement this function to parse CSV data
                console.log('studentsData:', studentsData);
                // Add the parsed students to the application
                const response = await StudentService.addStudnets(studentsData);
                if (response.status === 201) {
                    // Show success message
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Students Uploaded Successfully',
                        life: 3000
                    });
                    // Refresh the student data
                    StudentService.getStudents().then((data: Models.Student[]) => setStudents(data));
                } else {
                    // Show error message
                    throw new Error('Failed to upload students. Status: ' + response.status);
                }
            } catch (error) {
                // Handle error
                console.error('Error uploading students:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error Uploading Students: ' + error,
                    life: 3000
                });
            }
        };
    
        // Read the file as text
        reader.readAsText(file);
    };

    const parseCSV = async (csvData: string): Promise<Models.Student[]> => {
        return new Promise((resolve, reject) => {
            parse(csvData, { columns: true }, (err, records) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(records as Models.Student[]);
                }
            });
        });
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedStudents || !(selectedStudents as any).length} />
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
    const traineeNoBodyTemplate = (rowData: Models.Student) => {
        return (
            <>
                <span className="p-column-title">traineeNo</span>
                {rowData.traineeNo}
            </>
        );
    };

    const nameWithInitialsBodyTemplate = (rowData: Models.Student) => {
        return (
            <>
                <span className="p-column-title">nameWithInitials</span>
                {rowData.nameWithInitials}
            </>
        );
    };

    const addressBodyTemplate = (rowData: Models.Student) => {
        return (
            <>
                <span className="p-column-title">address</span>
                {rowData.address}
            </>
        );
    };

    const nicBodyTemplate = (rowData: Models.Student) => {
        return (
            <>
                <span className="p-column-title">nic</span>
                {rowData.nic}
            </>
        );
    };

    const genderBodyTemplate = (rowData: Models.Student) => {
        return (
            <>
                <span className="p-column-title">gender</span>
                {rowData.gender}
            </>
        );
    };
    const mobBodyTemplate = (rowData: Models.Student) => {
        return (
            <>
                <span className="p-column-title">mob</span>
                {rowData.mob}
            </>
        );
    };
    const batchBodyTemplate = (rowData: Models.Student) => {
        return (
            <>
                <span className="p-column-title">batch</span>
                {rowData.batch}
            </>
        );
    };
    const fingerPrintIDBodyTemplate = (rowData: Models.Student) => {
        return (
            <>
                <span className="p-column-title">fingerPrintID</span>
                {rowData.fingerPrintID}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Models.Student) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editStudent(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteStudent(rowData)} />
            </>
        );
    };
    //#endregion

    const header = students && (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            {/* //Bookmark: Table header */}
            <h5 className="m-0">Manage Students</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={globalFilterValue} onInput={handleGlobalFilterChange} placeholder="Search..." />
            </span>
        </div>
    );

    const studentDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveStudent} />
        </>
    );
    const deleteStudentDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteStudentDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteStudent} />
        </>
    );
    const deleteStudentsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteStudentsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedStudents} />
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
                        value={students}
                        selection={selectedStudents}
                        onSelectionChange={(e) => setSelectedStudents(e.value as any)}
                        dataKey="traineeNo"
                        paginator
                        rows={20}
                        rowsPerPageOptions={[25, 50, 100]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} students"
                        globalFilterFields={['traineeNo', 'nameWithInitials', 'address', 'nic', 'gender', 'mob', 'batch', 'fingerPrintID']}
                        emptyMessage="No students found."
                        header={header}
                    >
                        {/* Bookmark:Table Columns */}
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="traineeNo" header="traineeNo" sortable body={traineeNoBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="nameWithInitials" header="nameWithInitials" sortable body={nameWithInitialsBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="address" header="address" sortable body={addressBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nic" header="nic" sortable body={nicBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="gender" header="gender" sortable body={genderBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="mob" header="mob" sortable body={mobBodyTemplate} headerStyle={{ minWidth: '7rem' }}></Column>
                        <Column field="batch" header="batch" sortable body={batchBodyTemplate} headerStyle={{ minWidth: '6rem' }}></Column>
                        <Column field="fingerPrintID" header="fingerPrintID" sortable body={fingerPrintIDBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={studentDialog} style={{ width: '450px' }} header="Student Details" modal className="p-fluid" footer={studentDialogFooter} onHide={hideDialog}>
                        {/* Bookmark: Input Elements */}
                        {/* #region Input Elements */}
                        <div className="field">
                            <label htmlFor="traineeNo">traineeNo</label>
                            <InputText
                                id="traineeNo"
                                value={student.traineeNo}
                                onChange={(e) => onInputChange(e, 'traineeNo')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !student.traineeNo
                                })}
                            />
                            {submitted && !student.traineeNo && <small className="p-invalid">traineeNo is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="nameWithInitials">nameWithInitials</label>
                            <InputText
                                id="nameWithInitials"
                                value={student.nameWithInitials}
                                onChange={(e) => onInputChange(e, 'nameWithInitials')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !student.nameWithInitials
                                })}
                            />
                            {submitted && !student.nameWithInitials && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="address">address</label>
                            <InputText
                                id="address"
                                value={student.address}
                                onChange={(e) => onInputChange(e, 'address')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !student.address
                                })}
                            />
                            {submitted && !student.address && <small className="p-invalid">address is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="nic">nic</label>
                            <InputText
                                id="nic"
                                value={student.nic}
                                onChange={(e) => onInputChange(e, 'nic')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !student.nic
                                })}
                            />
                            {submitted && !student.nic && <small className="p-invalid">nic is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="gender">gender</label>
                            <Dropdown
                                value={selectedGender}
                                onChange={(e) => {
                                    setselectedGender(e.value.name);
                                }}
                                options={genders}
                                optionLabel="name"
                                optionValue="name"
                                className={classNames({
                                    'p-invalid': submitted && !student.gender
                                })}
                            />
                            {submitted && !student.gender && <small className="p-invalid">gender is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="mob">mob</label>
                            <InputText
                                id="mob"
                                value={student.mob}
                                onChange={(e) => onInputChange(e, 'mob')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !student.mob
                                })}
                            />
                            {submitted && !student.mob && <small className="p-invalid">mob is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="batch">Batch</label>
                            <Dropdown
                                id="batch"
                                value={selectedBatch}
                                options={batches}
                                onChange={(e) => setSelectedBatch(e.value)}
                                optionLabel="batchID" // Change this to the appropriate property of the batch object
                                optionValue="batchID"
                                placeholder="Select Batch" // Placeholder text for dropdown when no item is selected
                                className={classNames({
                                    'p-invalid': submitted && !student.batch
                                })}
                            />
                            {submitted && !student.batch && <small className="p-invalid">batch is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="fingerPrintID">fingerPrintID</label>
                            <InputText
                                id="fingerPrintID"
                                value={student.fingerPrintID}
                                onChange={(e) => onInputChange(e, 'fingerPrintID')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !student.fingerPrintID
                                })}
                            />
                            {submitted && !student.fingerPrintID && <small className="p-invalid">fingerPrintID is required.</small>}
                        </div>
                        {/* #endregion */}
                    </Dialog>

                    <Dialog visible={deleteStudentDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteStudentDialogFooter} onHide={hideDeleteStudentDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {student && (
                                <span>
                                    {/* TODO:change here delete message */}
                                    Are you sure you want to delete <b>{student.nameWithInitials}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteStudentsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteStudentsDialogFooter} onHide={hideDeleteStudentsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {selectedStudents && <span>Are you sure you want to delete the {selectedStudents.length} selected students?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;