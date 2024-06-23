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
//import { PaymentService } from '../../../../data/service/PaymentService';
import { PaymentService } from '@/data/service/PaymentService';
import { Models } from '@/types/models';
import { Skeleton } from 'primereact/skeleton';
import { VirtualScrollerLoadingTemplateOptions } from 'primereact/virtualscroller';
import { parse } from 'csv-parse';
import { InputNumberChangeEvent } from 'primereact/inputnumber';
import { FormEvent } from 'primereact/ts-helpers';
import { Calendar} from 'primereact/calendar';
import { FormTarget } from 'primereact/ts-helpers';

const Crud = () => {
    //Bookmark:empty model
    let emptyPayment: Models.Payment = {
        traineeNo: '',
        paymentID: '',
        amount: 0 ,
        pDate: new Date(),
    };

    const [Payments, setPayments] = useState<Models.Payment[] | null>(null);
    const [PaymentDialog, setPaymentDialog] = useState(false);
    const [deletePaymentDialog, setDeletePaymentDialog] = useState(false);
    const [deletePaymentsDialog, setDeletePaymentsDialog] = useState(false);
    const [Payment, setPayment] = useState<Models.Payment>(emptyPayment);
    const [selectedPayments, setSelectedPayments] = useState<Models.Payment[] | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    const [lazyLoading, setLazyLoading] = useState<boolean>(false);
    //combo box data
    const [batches, setPaymentes] = useState<Models.Payment[]>([]);
    const [selectedPayment, setSelectedPayment] = useState<string>('');
    const [selectedGender, setselectedGender] = useState<string>('');
    const genders = [{ name: 'Male' }, { name: 'Female' }];

    //Bookmark: main fetch event
    useEffect(() => {
        PaymentService.getPayments().then((data: Models.Payment[]) => setPayments(data));
       // fetchPaymentes();
    }, []);

    //Bookmark : combo box events
    //#region combo box events
    // useEffect(() => {
    //     setselectedGender(Payment.gender);
    //     setSelectedPayment(Payment.batch);
    // }, [Payment]);

    // useEffect(() => {
    //     let _Payment = { ...Payment };
    //     _Payment.gender = selectedGender;
    //     setPayment(_Payment);
    // }, [selectedGender]);

    // useEffect(() => {
    //     let _Payment = { ...Payment };
    //     _Payment.batch = selectedPayment;
    //     setPayment(_Payment);
    // }, [selectedPayment]);

    // Function to fetch batches
    // const fetchPaymentes = async () => {
    //     try {
    //         const batchesData = await PaymentService.getPayments();
    //         setPaymentes(batchesData);
    //         {
    //             console.log('batches' + JSON.stringify(batches));
    //         }
    //     } catch (error) {
    //         console.error('Error fetching batches:', error);
    //     }
    // };

    //#endregion
    const openNew = () => {
        setPayment(emptyPayment);
        setSubmitted(false);
        setPaymentDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPaymentDialog(false);
    };

    const hideDeletePaymentDialog = () => {
        setDeletePaymentDialog(false);
    };

    const hideDeletePaymentsDialog = () => {
        setDeletePaymentsDialog(false);
    };

    //Bookmark: Save Payment
    const savePayment = async () => {
        setSubmitted(true);

        if (Payment.paymentID) {
            let _Payments = [...(Payments as any)];
            let _Payment = { ...Payment };
            const index = findIndexById(Payment.paymentID);
            console.log('index ' + index);
            if (index != -1) {
                _Payments[index] = _Payment;
                try {
                   // _Payments.push(_Payment);
                    const response: Response = await PaymentService.updatePayment(encodeURIComponent(Payment.paymentID), _Payment);

                    // Check if the response status is 201 (Created)
                    if (response.status === 204) {
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Payment Updated',
                            life: 3000
                        });
                    } else {
                        // If response status is not 201, show error message
                        throw new Error('Failed to Update Payment. Status: ' + response.status);
                    }
                } catch (error) {
                    const errorMessage = (error as Error).message; // Type assertion
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error Updating Payment: ' + errorMessage,
                        life: 3000
                    });
                }
            } else {
                //_Payment.id = createId();
                //_Payment.image = 'Payment-placeholder.svg';
                try {
                    _Payments.push(_Payment);
                    // PaymentService.addPayment(_Payment);
                    const response: Response = await PaymentService.addPayment(_Payment);

                    // Check if the response status is 201 (Created)
                    if (response.status === 201) {
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Payment Created',
                            life: 3000
                        });
                    } else {
                        // If response status is not 201, show error message
                        throw new Error('Failed to create Payment. Status: ' + response.status);
                    }
                } catch (error) {
                    const errorMessage = (error as Error).message; // Type assertion
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error creating Payment: ' + errorMessage,
                        life: 3000
                    });
                }
            }
            setPayments(_Payments as any);
            setPaymentDialog(false);
            setPayment(emptyPayment);
        }
    };

    //Bookmark: Edit Payment
    const editPayment = async (b: Models.Payment) => {
        console.log('b' + JSON.stringify(b));
        setPayment({ ...b });
        console.log('Payment' + JSON.stringify(Payment));
        setPaymentDialog(true);
    };

    const confirmDeletePayment = async (Payment: Models.Payment) => {
        setPayment(Payment);
        setDeletePaymentDialog(true); 
    };
//Bookmark: Delete Payment
    const deletePayment = async () => {
        try {
            let _Payments = (Payments as any)?.filter((val: any) => val.paymentID !== Payment.paymentID);
            setPayments(_Payments);
            setDeletePaymentDialog(false);
            const response: Response = await PaymentService.deletePayment(encodeURIComponent(Payment.paymentID));
            setPayment(emptyPayment);
            if (response.status === 204) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Payment Deleted',
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
            console.error('Error deleting Payment:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error deleting Payment',
                life: 3000
            });
        }
    };

    const findIndexById = (paymentID: string) => {
        let index = -1;
        console.log(('Payments as any' + Payments) as any);
        for (let i = 0; i < (Payments as any)?.length; i++) {
            //TODO: change here select index
            if ((Payments as any)[i].paymentID === paymentID) {
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
        setDeletePaymentsDialog(true);
    };

    //Bookmark: Delete multiple Payments
    const deleteSelectedPayments = async () => {
        let _Payments = (Payments as any)?.filter((val: any) => !(selectedPayments as any)?.includes(val));
        setPayments(_Payments);
        setDeletePaymentsDialog(false);
        setSelectedPayments(null);
        try {
            //let _Payments = (Payments as any)?.filter((val: any) => val.id !== Payment.id);
            //setPayments(_Payments);
            setDeletePaymentDialog(false);
            const response: Response = await PaymentService.deletePayments(selectedPayments as any);
            setSelectedPayments(null);
            if (response.status === 204) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Payment Deleted',
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
            console.error('Error deleting Payment:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error deleting Payment',
                life: 3000
            });
        }
    };
    //Bookmark: Input change event
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement  > | InputNumberChangeEvent | FormEvent  , name: string) => {
        
        try {
            let val: string | number | Date  = '';
        if ('target' in e) {
            val = (e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
        } else {
            val = e.value+'';

        }
        let _Payment = { ...Payment };
        _Payment[`${name}`] = val;
        setPayment(_Payment);
        } catch (error) {
            console.error('Error updating Payment:', error);
        }
    };

    const onPaymentIDChange = (value:FormTarget<string>) => {
        let _Payment = { ...Payment };
        _Payment.paymentID = value.value+'';
        setPayment(_Payment);
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
                const PaymentsData = await parseCSV(csvData); // Implement this function to parse CSV data
                console.log('PaymentsData:', PaymentsData);
                // Add the parsed Payments to the application
                const response = await PaymentService.addPayments(PaymentsData);
                if (response.status === 201) {
                    // Show success message
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Payments Uploaded Successfully',
                        life: 3000
                    });
                    // Refresh the Payment data
                    PaymentService.getPayments().then((data: Models.Payment[]) => setPayments(data));
                } else {
                    // Show error message
                    throw new Error('Failed to upload Payments. Status: ' + response.status);
                }
            } catch (error) {
                // Handle error
                console.error('Error uploading Payments:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error Uploading Payments: ' + error,
                    life: 3000
                });
            }
        };
    
        // Read the file as text
        reader.readAsText(file);
    };

    const parseCSV = async (csvData: string): Promise<Models.Payment[]> => {
        return new Promise((resolve, reject) => {
            parse(csvData, { columns: true }, (err, records) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(records as Models.Payment[]);
                }
            });
        });
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedPayments || !(selectedPayments as any).length} />
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
    const traineeNoBodyTemplate = (rowData: Models.Payment) => {
        return (
            <>
                <span className="p-column-title">traineeNo</span>
                {rowData.traineeNo}
            </>
        );
    };

    const paymentIDBodyTemplate = (rowData: Models.Payment) => {
        return (
            <>
                <span className="p-column-title">paymentID</span>
                {rowData.paymentID}
            </>
        );
    };

    const amountBodyTemplate = (rowData: Models.Payment) => {
        return (
            <>
                <span className="p-column-title">amount</span>
                {rowData.amount}
            </>
        );
    };

    const pDateBodyTemplate = (rowData: Models.Payment) => {
        return (
            <>
                <span className="p-column-title">pDate</span>
                {rowData.pDate.toString()}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Models.Payment) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editPayment(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeletePayment(rowData)} />
            </>
        );
    };
    //#endregion

    const header = Payments && (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            {/* //Bookmark: Table header */}
            <h5 className="m-0">Manage Payments</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={globalFilterValue} onInput={handleGlobalFilterChange} placeholder="Search..." />
            </span>
        </div>
    );

    const PaymentDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={savePayment} />
        </>
    );
    const deletePaymentDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeletePaymentDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deletePayment} />
        </>
    );
    const deletePaymentsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeletePaymentsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedPayments} />
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
                        value={Payments}
                        selection={selectedPayments}
                        onSelectionChange={(e) => setSelectedPayments(e.value as any)}
                        dataKey="paymentID"
                        paginator
                        rows={20}
                        rowsPerPageOptions={[25, 50, 100]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Payments"
                        globalFilterFields={['paymentID', 'organizationName', 'address']}
                        emptyMessage="No Payments found."
                        header={header}
                    >
                        {/* Bookmark:Table Columns */}
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="traineeNo" header="traineeNo" sortable body={traineeNoBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="paymentID" header="paymentID" sortable body={paymentIDBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="amount" header="amount" sortable body={amountBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column> 
                        <Column field="pDate" header="pDate" sortable body={pDateBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column> 
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={PaymentDialog} style={{ width: '450px' }} header="Payment Details" modal className="p-fluid" footer={PaymentDialogFooter} onHide={hideDialog}>
                        {/* Bookmark: Input Elements */}
                        {/* #region Input Elements */}
                        <div className="field">
                            <label htmlFor="traineeNo">traineeNo</label>
                            <InputText
                                id="traineeNo"
                                value={Payment.traineeNo}
                                onChange={(e) => onInputChange(e,'traineeNo')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !Payment.traineeNo
                                })}
                            />
                            {submitted && !Payment.traineeNo && <small className="p-invalid">traineeNo is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="paymentID">paymentID</label>
                            <InputText
                                id="paymentID"
                                value={Payment.paymentID}
                                onChange={(e) => onInputChange(e, 'paymentID')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !Payment.paymentID
                                })}
                            />
                            {submitted && !Payment.paymentID && <small className="p-invalid">paymentID is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="amount">amount</label>
                            <InputText
                                id="amount"
                                value={Payment.amount+''}
                                onChange={(e) => onInputChange(e, 'amount')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !Payment.amount
                                })}
                            />
                            {submitted && !Payment.amount && <small className="p-invalid">amount is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="pDate">pDate</label>
                            <Calendar
                                id="pDate"
                                value={Payment.pDate}
                                onChange={(e) => onInputChange(e, 'pDate')}
                                required
                                autoFocus
                                dateFormat="dd/mm/yy"
                                className={classNames({
                                    'p-invalid': submitted && !Payment.pDate
                                })}
                            />
                            {submitted && !Payment.pDate && <small className="p-invalid">pDate is required.</small>}
                        </div>
                        
                        {/* #endregion */}
                    </Dialog>

                    <Dialog visible={deletePaymentDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePaymentDialogFooter} onHide={hideDeletePaymentDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {Payment && (
                                <span>
                                    {/* TODO:change here delete message */}
                                    Are you sure you want to delete <b>{Payment.paymentID}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePaymentsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePaymentsDialogFooter} onHide={hideDeletePaymentsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {selectedPayments && <span>Are you sure you want to delete the {selectedPayments.length} selected Payments?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;