/**
 * QuoteWise Quotation Service
 * Data access layer for quotation CRUD operations.
 * Currently returns mock data; will be replaced with Firestore queries.
 */

import { quotations as mockQuotations } from './mockData';

/**
 * Fetch all quotations.
 * TODO: Replace with Firestore collection query.
 * @returns {Promise<Array>} Array of quotation objects
 */
export async function fetchQuotations() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockQuotations;
}

/**
 * Fetch a single quotation by ID.
 * TODO: Replace with Firestore document query.
 * @param {string} id - Quotation ID
 * @returns {Promise<Object|null>} Quotation object or null
 */
export async function fetchQuotationById(id) {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const quotation = mockQuotations.find((q) => q.id === id);
  return quotation || null;
}

/**
 * Create a new quotation draft.
 * TODO: Replace with Firestore document creation.
 * @param {Object} data - Quotation data
 * @returns {Promise<Object>} Created quotation with generated ID
 */
export async function createDraft(data) {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const newQuotation = {
    ...data,
    id: `QT-${Date.now()}`,
    status: 'draft',
    date: new Date().toISOString().split('T')[0],
  };
  return newQuotation;
}

/**
 * Update an existing quotation.
 * TODO: Replace with Firestore document update.
 * @param {string} id - Quotation ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated quotation
 */
export async function updateQuotation(id, updates) {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return { id, ...updates };
}

/**
 * Delete a draft quotation.
 * TODO: Replace with Firestore document deletion.
 * @param {string} id - Quotation ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteQuotation(id) {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return true;
}

/**
 * Update quotation status (accept, reject, save).
 * TODO: Replace with Firestore document update.
 * @param {string} id - Quotation ID
 * @param {'accepted'|'rejected'|'saved'|'pending'|'draft'} status - New status
 * @returns {Promise<Object>} Updated quotation
 */
export async function updateQuotationStatus(id, status) {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return { id, status };
}

export default {
  fetchQuotations,
  fetchQuotationById,
  createDraft,
  updateQuotation,
  deleteQuotation,
  updateQuotationStatus,
};
