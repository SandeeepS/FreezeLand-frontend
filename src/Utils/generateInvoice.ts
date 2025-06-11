// utils/invoiceUtils.ts
import { IComplaintDetails, IMechanicDetails } from '../interfaces/IComponents/User/IUserInterfaces';

export interface InvoiceData {
  complaint: IComplaintDetails;
  mechanicDetails?: IMechanicDetails;
  totalAmount: number;
  paymentDate?: string;
  invoiceNumber?: string;
}

export const generateInvoicePDF = async (data: InvoiceData): Promise<void> => {
  const { complaint, totalAmount, paymentDate, invoiceNumber } = data;
  
  // Create HTML content for the invoice
  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Service Invoice</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          background: #fff;
        }
        
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          background: white;
        }
        
        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid #2563eb;
        }
        
        .company-info h1 {
          font-size: 28px;
          color: #2563eb;
          margin-bottom: 5px;
        }
        
        .company-info p {
          color: #666;
          font-size: 14px;
        }
        
        .invoice-details {
          text-align: right;
        }
        
        .invoice-details h2 {
          font-size: 32px;
          color: #2563eb;
          margin-bottom: 10px;
        }
        
        .invoice-details p {
          margin: 5px 0;
          font-size: 14px;
        }
        
        .invoice-meta {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        
        .bill-to, .service-info {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #2563eb;
        }
        
        .bill-to h3, .service-info h3 {
          color: #2563eb;
          margin-bottom: 15px;
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .bill-to p, .service-info p {
          margin: 8px 0;
          font-size: 14px;
        }
        
        .service-details {
          margin-bottom: 40px;
        }
        
        .service-details h3 {
          color: #2563eb;
          margin-bottom: 20px;
          font-size: 18px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .work-items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .work-items-table th {
          background: #2563eb;
          color: white;
          padding: 15px;
          text-align: left;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 1px;
        }
        
        .work-items-table td {
          padding: 15px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }
        
        .work-items-table tr:nth-child(even) {
          background: #f8fafc;
        }
        
        .work-items-table tr:hover {
          background: #f1f5f9;
        }
        
        .work-items-table .amount {
          font-weight: 600;
          color: #059669;
        }
        
        .totals {
          margin-left: auto;
          width: 300px;
        }
        
        .totals-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .totals-table td {
          padding: 10px 15px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .totals-table .label {
          font-weight: 600;
          color: #374151;
        }
        
        .totals-table .amount {
          text-align: right;
          font-weight: 600;
          color: #059669;
        }
        
        .total-row {
          background: #2563eb;
          color: white;
        }
        
        .total-row td {
          border: none;
          font-size: 18px;
          font-weight: 700;
        }
        
        .payment-info {
          margin-top: 40px;
          padding: 20px;
          background: #f0fdf4;
          border: 2px solid #22c55e;
          border-radius: 8px;
          text-align: center;
        }
        
        .payment-info h4 {
          color: #15803d;
          margin-bottom: 10px;
          font-size: 16px;
        }
        
        .payment-info p {
          color: #166534;
          font-weight: 600;
        }
        
        .footer {
          margin-top: 60px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
        }
        
        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .status-completed {
          background: #dcfce7;
          color: #166534;
        }
        
        @media print {
          .invoice-container {
            margin: 0;
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <!-- Invoice Header -->
        <div class="invoice-header">
          <div class="company-info">
            <h1>FreezeLand</h1>
            <p>Professional Service </p>
            <p>Email: support@freezeland.com</p>
            <p>Phone: +91 7658456375</p>
          </div>
          <div class="invoice-details">
            <h2>INVOICE</h2>
            <p><strong>Invoice #:</strong> ${invoiceNumber || 'INV-' + complaint._id.slice(-8).toUpperCase()}</p>
            <p><strong>Date:</strong> ${paymentDate || new Date().toLocaleDateString('en-IN')}</p>
            <p><strong>Status:</strong> <span class="status-badge status-completed">Paid</span></p>
          </div>
        </div>

        <!-- Invoice Meta Information -->
        <div class="invoice-meta">
          <div class="bill-to">
            <h3>Bill To</h3>
            <p><strong>${complaint.name || 'N/A'}</strong></p>
            <p>${(complaint.userDetails?.[0] as { email?: string })?.email || 'N/A'}</p>
            <p>${(complaint.userDetails?.[0] as { phone?: string })?.phone || 'N/A'}</p>
            <p>${(complaint.userDetails?.[0] as { address?: string })?.address || 'N/A'}</p>
          </div>
        </div>

        <!-- Service Details -->
        <div class="service-details">
          <h3>Service Details</h3>
          <p><strong>Service:</strong> ${complaint.serviceDetails?.[0]?.name || 'N/A'}</p>
          <p><strong>Request ID:</strong> ${complaint._id}</p>
          <p><strong>Service Date:</strong> ${complaint.acceptedAt ? new Date(complaint.acceptedAt).toLocaleDateString('en-IN') : 'N/A'}</p>
          <p><strong>Completion Date:</strong> N/A</p>
          ${complaint.discription ? `<p><strong>Description:</strong> ${complaint.discription}</p>` : ''}
        </div>

        <!-- Work Items Table -->
        <table class="work-items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${complaint.workDetails?.map(work => `
              <tr>
                <td>${work.description || 'Service Work'}</td>
                <td>1</td>
                <td class="amount">₹${work.amount || 0}</td>
                <td class="amount">₹${work.amount || 0}</td>
              </tr>
            `).join('') || `
              <tr>
                <td>Service Charge</td>
                <td>1</td>
                <td class="amount">₹${totalAmount}</td>
                <td class="amount">₹${totalAmount}</td>
              </tr>
            `}
          </tbody>
        </table>

        <!-- Totals -->
        <div class="totals">
          <table class="totals-table">
            <tr>
              <td class="label">Subtotal:</td>
              <td class="amount">₹${totalAmount}</td>
            </tr>
            <tr>
              <td class="label">Tax (0%):</td>
              <td class="amount">₹0.00</td>
            </tr>
            <tr class="total-row">
              <td>TOTAL:</td>
              <td>₹${totalAmount}</td>
            </tr>
          </table>
        </div>

        <!-- Payment Information -->
        <div class="payment-info">
          <h4>✅ Payment Received</h4>
          <p>This invoice has been paid in full on ${paymentDate || new Date().toLocaleDateString('en-IN')}</p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>Thank you for choosing FreezeLand. For any queries, please contact our support team.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  }
};