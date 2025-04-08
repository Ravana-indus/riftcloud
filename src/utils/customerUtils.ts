/**
 * Utility functions for handling customer data
 */

/**
 * Cleans a customer name by removing any numeric characters and special characters
 * For example: "John Doe - 12" becomes "John Doe"
 * 
 * @param name The customer name to clean
 * @returns The cleaned customer name
 */
export const cleanCustomerName = (name: string): string => {
  if (!name) return "Individual";
  
  // First remove the suffix pattern if present (e.g., " - 12")
  let cleanedName = name;
  if (name.includes(' - ')) {
    const nameParts = name.split(' - ');
    // If the last part is a number, remove it
    if (nameParts.length > 1 && !isNaN(parseInt(nameParts[nameParts.length - 1]))) {
      cleanedName = nameParts.slice(0, -1).join(' - ');
    }
  }
  
  // Now remove any remaining numbers and special characters
  cleanedName = cleanedName.replace(/[^\w\s]/gi, '')  // Remove special characters
    .replace(/\d+/g, '')  // Remove all numbers
    .trim()
    .replace(/\s+/g, ' ');  // Replace multiple spaces with a single space
  
  // If after cleaning, the name is empty, return "Individual"
  return cleanedName || "Individual";
};

export default {
  cleanCustomerName
}; 