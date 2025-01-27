import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString) {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return new Date(dateString).toLocaleDateString('en-US', options);
}

export function formatDateForAPI(dateString) {
  // Convert MM-DD-YYYY to YYYY-MM-DD
  const [month, day, year] = dateString.split('-');
  return `${year}-${month}-${day}`;
}

export function formatDateFromAPI(dateString) {
  // Convert YYYY-MM-DD to MM-DD-YYYY
  const [year, month, day] = dateString.split('-');
  return `${month}-${day}-${year}`;
}