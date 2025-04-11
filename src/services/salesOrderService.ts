import { API_BASE_URL, getApiHeaders } from '@/utils/apiConfig';

interface SalesOrderParams {
  leadId: string;
  customerName: string;
  itemCode: string;
  amount: number;
  currency: string;
}

/**
 * Format a date in YYYY-MM-DD format required by Frappe API
 */
const formatDateForFrappe = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Creates a sales order in the ERP system
 */
export const createSalesOrder = async (
  params: SalesOrderParams
): Promise<{ message: string; success: boolean; salesOrderId?: string }> => {
  try {
    console.log('Creating sales order with parameters:', params);
    
    const { leadId, customerName, itemCode, amount, currency } = params;
    
    // Format date in the required format YYYY-MM-DD
    const today = new Date();
    const formattedDate = formatDateForFrappe(today);
    
    // Prepare sales order data
    const salesOrderData = {
      doctype: 'Sales Order',
      naming_series: 'SAL-ORD-.YYYY.-',
      transaction_date: formattedDate,
      delivery_date: formattedDate,
      customer: customerName || 'Individual',
      order_type: 'Sales',
      currency: currency || 'LKR',
      items: [
        {
          item_code: itemCode || 'COURSE-001',
          qty: 1,
          rate: amount,
          amount: amount
        }
      ],
      custom_lead_reference: leadId || ''
    };
    
    console.log('Sales order data:', JSON.stringify(salesOrderData, null, 2));
    
    // Call Frappe API to create sales order
    const response = await fetch(`${API_BASE_URL}/resource/Sales Order`, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify(salesOrderData)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('Failed to create sales order:', result);
      throw new Error(`Failed to create sales order: ${result.message || 'Unknown error'}`);
    }
    
    console.log('Sales order created successfully:', result);
    return {
      message: 'Sales order created successfully',
      success: true,
      salesOrderId: result.data ? result.data.name : undefined
    };
  } catch (error) {
    console.error('Error creating sales order:', error);
    return {
      message: `Error creating sales order: ${error.message || 'Unknown error'}`,
      success: false
    };
  }
};