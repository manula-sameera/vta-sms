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
//import { OrganizationService } from '../../../../data/service/OrganizationService';
import { OrganizationService } from '@/data/service/OrganizationService';
import { Models } from '@/types/models';
import { Skeleton } from 'primereact/skeleton';
import { VirtualScrollerLoadingTemplateOptions } from 'primereact/virtualscroller';
import { parse } from 'csv-parse';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import { InputMaskChangeEvent } from "primereact/inputmask";
import { FormTarget, Nullable } from 'primereact/ts-helpers';

const Crud = () => {
    //Bookmark:empty model
    let emptyOrganization: Models.Organization = {
        organizationID: '',
        organizationName: '',
        address: ''
    };

    const [Organizations, setOrganizations] = useState<Models.Organization[] | null>(null);
    const [OrganizationDialog, setOrganizationDialog] = useState(false);
    const [deleteOrganizationDialog, setDeleteOrganizationDialog] = useState(false);
    const [deleteOrganizationsDialog, setDeleteOrganizationsDialog] = useState(false);
    const [Organization, setOrganization] = useState<Models.Organization>(emptyOrganization);
    const [selectedOrganizations, setSelectedOrganizations] = useState<Models.Organization[] | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    const [lazyLoading, setLazyLoading] = useState<boolean>(false);
    //combo box data
    const [batches, setOrganizationes] = useState<Models.Organization[]>([]);
    const [selectedOrganization, setSelectedOrganization] = useState<string>('');
    const [selectedGender, setselectedGender] = useState<string>('');
    const genders = [{ name: 'Male' }, { name: 'Female' }];

    //Bookmark: main fetch event
    useEffect(() => {
        OrganizationService.getOrganizations().then((data: Models.Organization[]) => setOrganizations(data));
       // fetchOrganizationes();
    }, []);

    //Bookmark : combo box events
    //#region combo box events
    // useEffect(() => {
    //     setselectedGender(Organization.gender);
    //     setSelectedOrganization(Organization.batch);
    // }, [Organization]);

    // useEffect(() => {
    //     let _Organization = { ...Organization };
    //     _Organization.gender = selectedGender;
    //     setOrganization(_Organization);
    // }, [selectedGender]);

    // useEffect(() => {
    //     let _Organization = { ...Organization };
    //     _Organization.batch = selectedOrganization;
    //     setOrganization(_Organization);
    // }, [selectedOrganization]);

    // Function to fetch batches
    // const fetchOrganizationes = async () => {
    //     try {
    //         const batchesData = await OrganizationService.getOrganizations();
    //         setOrganizationes(batchesData);
    //         {
    //             console.log('batches' + JSON.stringify(batches));
    //         }
    //     } catch (error) {
    //         console.error('Error fetching batches:', error);
    //     }
    // };

    //#endregion
    const openNew = () => {
        setOrganization(emptyOrganization);
        setSubmitted(false);
        setOrganizationDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setOrganizationDialog(false);
    };

    const hideDeleteOrganizationDialog = () => {
        setDeleteOrganizationDialog(false);
    };

    const hideDeleteOrganizationsDialog = () => {
        setDeleteOrganizationsDialog(false);
    };

    //Bookmark: Save Organization
    const saveOrganization = async () => {
        setSubmitted(true);

        if (Organization.organizationID) {
            let _Organizations = [...(Organizations as any)];
            let _Organization = { ...Organization };
            const index = findIndexById(Organization.organizationID);
            console.log('index ' + index);
            if (index != -1) {
                _Organizations[index] = _Organization;
                try {
                   // _Organizations.push(_Organization);
                    const response: Response = await OrganizationService.updateOrganization(encodeURIComponent(Organization.organizationID), _Organization);

                    // Check if the response status is 201 (Created)
                    if (response.status === 204) {
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Organization Updated',
                            life: 3000
                        });
                    } else {
                        // If response status is not 201, show error message
                        throw new Error('Failed to Update Organization. Status: ' + response.status);
                    }
                } catch (error) {
                    const errorMessage = (error as Error).message; // Type assertion
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error Updating Organization: ' + errorMessage,
                        life: 3000
                    });
                }
            } else {
                //_Organization.id = createId();
                //_Organization.image = 'Organization-placeholder.svg';
                try {
                    _Organizations.push(_Organization);
                    // OrganizationService.addOrganization(_Organization);
                    const response: Response = await OrganizationService.addOrganization(_Organization);

                    // Check if the response status is 201 (Created)
                    if (response.status === 201) {
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Organization Created',
                            life: 3000
                        });
                    } else {
                        // If response status is not 201, show error message
                        throw new Error('Failed to create Organization. Status: ' + response.status);
                    }
                } catch (error) {
                    const errorMessage = (error as Error).message; // Type assertion
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error creating Organization: ' + errorMessage,
                        life: 3000
                    });
                }
            }
            setOrganizations(_Organizations as any);
            setOrganizationDialog(false);
            setOrganization(emptyOrganization);
        }
    };

    //Bookmark: Edit Organization
    const editOrganization = async (b: Models.Organization) => {
        console.log('b' + JSON.stringify(b));
        setOrganization({ ...b });
        console.log('Organization' + JSON.stringify(Organization));
        setOrganizationDialog(true);
    };

    const confirmDeleteOrganization = async (Organization: Models.Organization) => {
        setOrganization(Organization);
        setDeleteOrganizationDialog(true); 
    };
//Bookmark: Delete Organization
    const deleteOrganization = async () => {
        try {
            let _Organizations = (Organizations as any)?.filter((val: any) => val.organizationID !== Organization.organizationID);
            setOrganizations(_Organizations);
            setDeleteOrganizationDialog(false);
            const response: Response = await OrganizationService.deleteOrganization(encodeURIComponent(Organization.organizationID));
            setOrganization(emptyOrganization);
            if (response.status === 204) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Organization Deleted',
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
            console.error('Error deleting Organization:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error deleting Organization',
                life: 3000
            });
        }
    };

    const findIndexById = (organizationID: string) => {
        let index = -1;
        console.log(('Organizations as any' + Organizations) as any);
        for (let i = 0; i < (Organizations as any)?.length; i++) {
            //TODO: change here select index
            if ((Organizations as any)[i].organizationID === organizationID) {
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
        setDeleteOrganizationsDialog(true);
    };

    //Bookmark: Delete multiple Organizations
    const deleteSelectedOrganizations = async () => {
        let _Organizations = (Organizations as any)?.filter((val: any) => !(selectedOrganizations as any)?.includes(val));
        setOrganizations(_Organizations);
        setDeleteOrganizationsDialog(false);
        setSelectedOrganizations(null);
        try {
            //let _Organizations = (Organizations as any)?.filter((val: any) => val.id !== Organization.id);
            //setOrganizations(_Organizations);
            setDeleteOrganizationDialog(false);
            const response: Response = await OrganizationService.deleteOrganizations(selectedOrganizations as any);
            setSelectedOrganizations(null);
            if (response.status === 204) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Organization Deleted',
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
            console.error('Error deleting Organization:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error deleting Organization',
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
        let _Organization = { ...Organization };
        _Organization[`${name}`] = val;
        setOrganization(_Organization);
        } catch (error) {
            console.error('Error updating Organization:', error);
        }
    };

    const onOrganizationIDChange = (value:FormTarget<string>) => {
        let _Organization = { ...Organization };
        _Organization.organizationID = value.value+'';
        setOrganization(_Organization);
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
                const OrganizationsData = await parseCSV(csvData); // Implement this function to parse CSV data
                console.log('OrganizationsData:', OrganizationsData);
                // Add the parsed Organizations to the application
                const response = await OrganizationService.addOrganizations(OrganizationsData);
                if (response.status === 201) {
                    // Show success message
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Organizations Uploaded Successfully',
                        life: 3000
                    });
                    // Refresh the Organization data
                    OrganizationService.getOrganizations().then((data: Models.Organization[]) => setOrganizations(data));
                } else {
                    // Show error message
                    throw new Error('Failed to upload Organizations. Status: ' + response.status);
                }
            } catch (error) {
                // Handle error
                console.error('Error uploading Organizations:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error Uploading Organizations: ' + error,
                    life: 3000
                });
            }
        };
    
        // Read the file as text
        reader.readAsText(file);
    };

    const parseCSV = async (csvData: string): Promise<Models.Organization[]> => {
        return new Promise((resolve, reject) => {
            parse(csvData, { columns: true }, (err, records) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(records as Models.Organization[]);
                }
            });
        });
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedOrganizations || !(selectedOrganizations as any).length} />
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
    const organizationIDBodyTemplate = (rowData: Models.Organization) => {
        return (
            <>
                <span className="p-column-title">organizationID</span>
                {rowData.organizationID}
            </>
        );
    };

    const organizationNameBodyTemplate = (rowData: Models.Organization) => {
        return (
            <>
                <span className="p-column-title">organizationName</span>
                {rowData.organizationName}
            </>
        );
    };

    const addressBodyTemplate = (rowData: Models.Organization) => {
        return (
            <>
                <span className="p-column-title">address</span>
                {rowData.address}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Models.Organization) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editOrganization(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteOrganization(rowData)} />
            </>
        );
    };
    //#endregion

    const header = Organizations && (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            {/* //Bookmark: Table header */}
            <h5 className="m-0">Manage Organizations</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={globalFilterValue} onInput={handleGlobalFilterChange} placeholder="Search..." />
            </span>
        </div>
    );

    const OrganizationDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveOrganization} />
        </>
    );
    const deleteOrganizationDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteOrganizationDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteOrganization} />
        </>
    );
    const deleteOrganizationsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteOrganizationsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedOrganizations} />
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
                        value={Organizations}
                        selection={selectedOrganizations}
                        onSelectionChange={(e) => setSelectedOrganizations(e.value as any)}
                        dataKey="organizationID"
                        paginator
                        rows={20}
                        rowsPerPageOptions={[25, 50, 100]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Organizations"
                        globalFilterFields={['organizationID', 'organizationName', 'address']}
                        emptyMessage="No Organizations found."
                        header={header}
                    >
                        {/* Bookmark:Table Columns */}
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="organizationID" header="organizationID" sortable body={organizationIDBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="organizationName" header="organizationName" sortable body={organizationNameBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="address" header="address" sortable body={addressBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column> 
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={OrganizationDialog} style={{ width: '450px' }} header="Organization Details" modal className="p-fluid" footer={OrganizationDialogFooter} onHide={hideDialog}>
                        {/* Bookmark: Input Elements */}
                        {/* #region Input Elements */}
                        <div className="field">
                            <label htmlFor="organizationID">OrganizationID</label>
                            <InputText
                                id="organizationID"
                                value={Organization.organizationID}
                                onChange={(e) => onInputChange(e,'organizationID')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !Organization.organizationID
                                })}
                            />
                            {submitted && !Organization.organizationID && <small className="p-invalid">organizationID is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="organizationName">organizationName</label>
                            <InputText
                                id="organizationName"
                                value={Organization.organizationName}
                                onChange={(e) => onInputChange(e, 'organizationName')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !Organization.organizationName
                                })}
                            />
                            {submitted && !Organization.organizationName && <small className="p-invalid">organizationName is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="address">address</label>
                            <InputText
                                id="address"
                                value={Organization.address}
                                onChange={(e) => onInputChange(e, 'address')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !Organization.address
                                })}
                            />
                            {submitted && !Organization.address && <small className="p-invalid">address is required.</small>}
                        </div>
                        
                        {/* #endregion */}
                    </Dialog>

                    <Dialog visible={deleteOrganizationDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteOrganizationDialogFooter} onHide={hideDeleteOrganizationDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {Organization && (
                                <span>
                                    {/* TODO:change here delete message */}
                                    Are you sure you want to delete <b>{Organization.organizationName}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteOrganizationsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteOrganizationsDialogFooter} onHide={hideDeleteOrganizationsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {selectedOrganizations && <span>Are you sure you want to delete the {selectedOrganizations.length} selected Organizations?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;