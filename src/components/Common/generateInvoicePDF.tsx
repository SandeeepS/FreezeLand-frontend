// InvoiceGenerator.tsx
import React from 'react';
import { Download, Receipt } from '@mui/icons-material';
import { Button, CircularProgress } from '@mui/material';
import { IComplaintDetails, IMechanicDetails } from '../../interfaces/IComponents/User/IUserInterfaces';
import { generateInvoicePDF, InvoiceData } from '../../Utils/generateInvoice';

interface InvoiceDownloadButtonProps {
  complaint: IComplaintDetails;
  mechanicDetails?: IMechanicDetails;
  totalAmount: number;
  isDownloading?: boolean;
}

const InvoiceDownloadButton: React.FC<InvoiceDownloadButtonProps> = ({
  complaint,
  mechanicDetails,
  totalAmount,
  isDownloading = false
}) => {
  const [downloading, setDownloading] = React.useState(false);

  const handleDownloadInvoice = async () => {
    setDownloading(true);
    
    try {
      const invoiceData: InvoiceData = {
        complaint,
        mechanicDetails,
        totalAmount,
        paymentDate: new Date().toLocaleDateString('en-IN'),
        invoiceNumber: `INV-${complaint._id.slice(-8).toUpperCase()}`
      };

      await generateInvoicePDF(invoiceData);
    } catch (error) {
      console.error('Error generating invoice:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow p-6">
      <div className="text-center">
        <div className="mb-4">
          <Receipt className="w-16 h-16 mx-auto text-green-500 mb-2" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Payment Completed Successfully!
          </h3>
          <p className="text-gray-600 mb-4">
            Your service has been completed and payment has been processed. 
            Download your invoice for your records.
          </p>
        </div>
        
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={downloading ? <CircularProgress size={20} color="inherit" /> : <Download />}
          onClick={handleDownloadInvoice}
          disabled={downloading || isDownloading}
          className="min-w-48"
          sx={{
            background: 'linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.25)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1d4ed8 30%, #2563eb 90%)',
              boxShadow: '0 6px 20px 0 rgba(37, 99, 235, 0.35)',
            },
            '&:disabled': {
              background: '#e5e7eb',
              color: '#6b7280'
            }
          }}
        >
          {downloading ? 'Generating Invoice...' : 'Download Invoice'}
        </Button>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>Invoice will be downloaded as a PDF document</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDownloadButton;