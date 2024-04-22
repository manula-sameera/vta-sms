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
//import { BatchService } from '../../../../data/service/BatchService';
import { BatchService } from '@/data/service/BatchService';
import { Models } from '@/types/models';
import { Skeleton } from 'primereact/skeleton';
import { VirtualScrollerLoadingTemplateOptions } from 'primereact/virtualscroller';
import { parse } from 'csv-parse';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import { InputMaskChangeEvent } from "primereact/inputmask";
import { FormTarget, Nullable } from 'primereact/ts-helpers';

const Crud = () => {
    //Bookmark:empty model
    let emptyBatch: Models.Batch = {
        batchID: '',
        batch: '',
        bYear: 0,
        organizationID: '',
        bAmount: 0,
        courseID: '',
        heldDays: '',
        bTarget: ''
    };

    const [Batchs, setBatchs] = useState<Models.Batch[] | null>(null);
    const [BatchDialog, setBatchDialog] = useState(false);
    const [deleteBatchDialog, setDeleteBatchDialog] = useState(false);
    const [deleteBatchsDialog, setDeleteBatchsDialog] = useState(false);
    const [Batch, setBatch] = useState<Models.Batch>(emptyBatch);
    const [selectedBatchs, setSelectedBatchs] = useState<Models.Batch[] | null>(null);
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
        BatchService.getBatchs().then((data: Models.Batch[]) => setBatchs(data));
       // fetchBatches();
    }, []);

    //Bookmark : combo box events
    //#region combo box events
    // useEffect(() => {
    //     setselectedGender(Batch.gender);
    //     setSelectedBatch(Batch.batch);
    // }, [Batch]);

    useEffect(() => {
        let _Batch = { ...Batch };
        _Batch.gender = selectedGender;
        setBatch(_Batch);
    }, [selectedGender]);

    useEffect(() => {
        let _Batch = { ...Batch };
        _Batch.batch = selectedBatch;
        setBatch(_Batch);
    }, [selectedBatch]);

    // Function to fetch batches
    // const fetchBatches = async () => {
    //     try {
    //         const batchesData = await BatchService.getBatchs();
    //         setBatches(batchesData);
    //         {
    //             console.log('batches' + JSON.stringify(batches));
    //         }
    //     } catch (error) {
    //         console.error('Error fetching batches:', error);
    //     }
    // };

    //#endregion
    const openNew = () => {
        setBatch(emptyBatch);
        setSubmitted(false);
        setBatchDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setBatchDialog(false);
    };

    const hideDeleteBatchDialog = () => {
        setDeleteBatchDialog(false);
    };

    const hideDeleteBatchsDialog = () => {
        setDeleteBatchsDialog(false);
    };

    //Bookmark: Save Batch
    const saveBatch = async () => {
        setSubmitted(true);

        if (Batch.batchID) {
            let _Batchs = [...(Batchs as any)];
            let _Batch = { ...Batch };
            const index = findIndexById(Batch.batchID);
            console.log('index ' + index);
            if (index != -1) {
                _Batchs[index] = _Batch;
                try {
                   // _Batchs.push(_Batch);
                    const response: Response = await BatchService.updateBatch(encodeURIComponent(Batch.batchID), _Batch);

                    // Check if the response status is 201 (Created)
                    if (response.status === 204) {
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Batch Updated',
                            life: 3000
                        });
                    } else {
                        // If response status is not 201, show error message
                        throw new Error('Failed to Update Batch. Status: ' + response.status);
                    }
                } catch (error) {
                    const errorMessage = (error as Error).message; // Type assertion
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error Updating Batch: ' + errorMessage,
                        life: 3000
                    });
                }
            } else {
                //_Batch.id = createId();
                //_Batch.image = 'Batch-placeholder.svg';
                try {
                    _Batchs.push(_Batch);
                    // BatchService.addBatch(_Batch);
                    const response: Response = await BatchService.addBatch(_Batch);

                    // Check if the response status is 201 (Created)
                    if (response.status === 201) {
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Batch Created',
                            life: 3000
                        });
                    } else {
                        // If response status is not 201, show error message
                        throw new Error('Failed to create Batch. Status: ' + response.status);
                    }
                } catch (error) {
                    const errorMessage = (error as Error).message; // Type assertion
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error creating Batch: ' + errorMessage,
                        life: 3000
                    });
                }
            }
            setBatchs(_Batchs as any);
            setBatchDialog(false);
            setBatch(emptyBatch);
        }
    };

    //Bookmark: Edit Batch
    const editBatch = async (b: Models.Batch) => {
        console.log('b' + JSON.stringify(b));
        setBatch({ ...b });
        console.log('Batch' + JSON.stringify(Batch));
        setBatchDialog(true);
    };

    const confirmDeleteBatch = async (Batch: Models.Batch) => {
        setBatch(Batch);
        setDeleteBatchDialog(true); 
    };
//Bookmark: Delete Batch
    const deleteBatch = async () => {
        try {
            let _Batchs = (Batchs as any)?.filter((val: any) => val.batchID !== Batch.batchID);
            setBatchs(_Batchs);
            setDeleteBatchDialog(false);
            const response: Response = await BatchService.deleteBatch(encodeURIComponent(Batch.batchID));
            setBatch(emptyBatch);
            if (response.status === 204) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Batch Deleted',
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
            console.error('Error deleting Batch:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error deleting Batch',
                life: 3000
            });
        }
    };

    const findIndexById = (batchID: string) => {
        let index = -1;
        console.log(('Batchs as any' + Batchs) as any);
        for (let i = 0; i < (Batchs as any)?.length; i++) {
            //TODO: change here select index
            if ((Batchs as any)[i].batchID === batchID) {
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
        setDeleteBatchsDialog(true);
    };

    //Bookmark: Delete multiple Batchs
    const deleteSelectedBatchs = async () => {
        let _Batchs = (Batchs as any)?.filter((val: any) => !(selectedBatchs as any)?.includes(val));
        setBatchs(_Batchs);
        setDeleteBatchsDialog(false);
        setSelectedBatchs(null);
        try {
            //let _Batchs = (Batchs as any)?.filter((val: any) => val.id !== Batch.id);
            //setBatchs(_Batchs);
            setDeleteBatchDialog(false);
            const response: Response = await BatchService.deleteBatchs(selectedBatchs as any);
            setSelectedBatchs(null);
            if (response.status === 204) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Batch Deleted',
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
            console.error('Error deleting Batch:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error deleting Batch',
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
        let _Batch = { ...Batch };
        _Batch[`${name}`] = val;
        setBatch(_Batch);
        } catch (error) {
            console.error('Error updating Batch:', error);
        }
    };

    const onBatchIDChange = (value:FormTarget<string>) => {
        let _Batch = { ...Batch };
        _Batch.batchID = value.value+'';
        setBatch(_Batch);
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
                const BatchsData = await parseCSV(csvData); // Implement this function to parse CSV data
                console.log('BatchsData:', BatchsData);
                // Add the parsed Batchs to the application
                const response = await BatchService.addBatchs(BatchsData);
                if (response.status === 201) {
                    // Show success message
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Batchs Uploaded Successfully',
                        life: 3000
                    });
                    // Refresh the Batch data
                    BatchService.getBatchs().then((data: Models.Batch[]) => setBatchs(data));
                } else {
                    // Show error message
                    throw new Error('Failed to upload Batchs. Status: ' + response.status);
                }
            } catch (error) {
                // Handle error
                console.error('Error uploading Batchs:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error Uploading Batchs: ' + error,
                    life: 3000
                });
            }
        };
    
        // Read the file as text
        reader.readAsText(file);
    };

    const parseCSV = async (csvData: string): Promise<Models.Batch[]> => {
        return new Promise((resolve, reject) => {
            parse(csvData, { columns: true }, (err, records) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(records as Models.Batch[]);
                }
            });
        });
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedBatchs || !(selectedBatchs as any).length} />
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
    const batchIDBodyTemplate = (rowData: Models.Batch) => {
        return (
            <>
                <span className="p-column-title">batchID</span>
                {rowData.batchID}
            </>
        );
    };

    const batchBodyTemplate = (rowData: Models.Batch) => {
        return (
            <>
                <span className="p-column-title">batch</span>
                {rowData.batch}
            </>
        );
    };

    const bYearBodyTemplate = (rowData: Models.Batch) => {
        return (
            <>
                <span className="p-column-title">bYear</span>
                {rowData.bYear}
            </>
        );
    };

    const organizationIDBodyTemplate = (rowData: Models.Batch) => {
        return (
            <>
                <span className="p-column-title">organizationID</span>
                {rowData.organizationID}
            </>
        );
    };

    const bAmountBodyTemplate = (rowData: Models.Batch) => {
        return (
            <>
                <span className="p-column-title">bAmount</span>
                {rowData.bAmount.toLocaleString('sl-US', { style: 'currency', currency: 'LKR' })}
            </>
        );
    };
    const courseIDBodyTemplate = (rowData: Models.Batch) => {
        return (
            <>
                <span className="p-column-title">courseID</span>
                {rowData.courseID}
            </>
        );
    };
    const heldDaysBodyTemplate = (rowData: Models.Batch) => {
        return (
            <>
                <span className="p-column-title">heldDays</span>
                {rowData.heldDays}
            </>
        );
    };
    const bTargetBodyTemplate = (rowData: Models.Batch) => {
        return (
            <>
                <span className="p-column-title">bTarget</span>
                {rowData.bTarget}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Models.Batch) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editBatch(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteBatch(rowData)} />
            </>
        );
    };
    //#endregion

    const header = Batchs && (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            {/* //Bookmark: Table header */}
            <h5 className="m-0">Manage Batchs</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={globalFilterValue} onInput={handleGlobalFilterChange} placeholder="Search..." />
            </span>
        </div>
    );

    const BatchDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveBatch} />
        </>
    );
    const deleteBatchDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteBatchDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteBatch} />
        </>
    );
    const deleteBatchsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteBatchsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedBatchs} />
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
                        value={Batchs}
                        selection={selectedBatchs}
                        onSelectionChange={(e) => setSelectedBatchs(e.value as any)}
                        dataKey="batchID"
                        paginator
                        rows={20}
                        rowsPerPageOptions={[25, 50, 100]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Batchs"
                        globalFilterFields={['batchID', 'batch', 'bYear', 'organizationID', 'bAmount', 'courseID', 'heldDays']}
                        emptyMessage="No Batchs found."
                        header={header}
                    >
                        {/* Bookmark:Table Columns */}
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="batchID" header="batchID" sortable body={batchIDBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="batch" header="batch" sortable body={batchBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="bYear" header="bYear" sortable body={bYearBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="organizationID" header="organizationID" sortable body={organizationIDBodyTemplate} headerStyle={{ minWidth: '7rem' }}></Column>
                        <Column field="bAmount" header="bAmount" sortable body={bAmountBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="courseID" header="courseID" sortable body={courseIDBodyTemplate} headerStyle={{ minWidth: '6rem' }}></Column>
                        <Column field="heldDays" header="heldDays" sortable body={heldDaysBodyTemplate} headerStyle={{ minWidth: '4rem' }}></Column>
                        <Column field="bTarget" header="bTarget" sortable body={bTargetBodyTemplate} headerStyle={{ minWidth: '3rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={BatchDialog} style={{ width: '450px' }} header="Batch Details" modal className="p-fluid" footer={BatchDialogFooter} onHide={hideDialog}>
                        {/* Bookmark: Input Elements */}
                        {/* #region Input Elements */}
                        <div className="field">
                            <label htmlFor="batchID">BatchID</label>
                            <InputText
                                id="batchID"
                                value={Batch.batchID}
                                onChange={(e) => onInputChange(e,'batchID')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !Batch.batchID
                                })}
                            />
                            {submitted && !Batch.batchID && <small className="p-invalid">batchID is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="batch">batch</label>
                            <InputText
                                id="batch"
                                value={Batch.batch}
                                onChange={(e) => onInputChange(e, 'batch')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !Batch.batch
                                })}
                            />
                            {submitted && !Batch.batch && <small className="p-invalid">batch is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="BYear">BYear</label>
                            <InputNumber
                                id="bYear"
                                value={Batch.bYear}
                                onChange={(e) => onInputChange(e, 'bYear')}
                                required
                                autoFocus
                                maxLength={4}
                                useGrouping={false}
                                className={classNames({
                                    'p-invalid': submitted && !Batch.bYear
                                })}
                            />
                            {submitted && !Batch.bYear && <small className="p-invalid">bYear is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="OrganizationID">organizationID</label>
                            <InputText
                                id="organizationID"
                                value={Batch.organizationID}
                                onChange={(e) => onInputChange(e, 'organizationID')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !Batch.organizationID
                                })}
                            />
                            {submitted && !Batch.organizationID && <small className="p-invalid">organizationID is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="BAmount">bAmount</label>
                            <InputNumber
                                id="bAmount"
                                value={Batch.bAmount}
                                onChange={(e) => onInputChange(e, 'bAmount')}
                                required
                                autoFocus
                                mode="currency"
                                currency="LKR"
                                className={classNames({
                                    'p-invalid': submitted && !Batch.bAmount
                                })}
                            />
                            {submitted && !Batch.bAmount && <small className="p-invalid">bAmount is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="CourseID">courseID</label>
                            <InputText
                                id="courseID"
                                value={Batch.courseID}
                                onChange={(e) => onInputChange(e, 'courseID')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !Batch.courseID
                                })}
                            />
                            {submitted && !Batch.courseID && <small className="p-invalid">courseID is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="heldDays">heldDays</label>
                            <InputText
                                id="heldDays"
                                value={Batch.heldDays}
                                onChange={(e) => onInputChange(e, 'heldDays')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !Batch.heldDays
                                })}
                            />
                            {submitted && !Batch.heldDays && <small className="p-invalid">heldDays is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="bTarget">bTarget</label>
                            <InputText
                                id="bTarget"
                                value={Batch.bTarget}
                                onChange={(e) => onInputChange(e, 'bTarget')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !Batch.bTarget
                                })}
                            />
                            {submitted && !Batch.bTarget && <small className="p-invalid">bTarget is required.</small>}
                        </div>
                        {/* #endregion */}
                    </Dialog>

                    <Dialog visible={deleteBatchDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteBatchDialogFooter} onHide={hideDeleteBatchDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {Batch && (
                                <span>
                                    {/* TODO:change here delete message */}
                                    Are you sure you want to delete <b>{Batch.batchID}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteBatchsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteBatchsDialogFooter} onHide={hideDeleteBatchsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {selectedBatchs && <span>Are you sure you want to delete the {selectedBatchs.length} selected Batchs?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;