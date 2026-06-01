/**
 * QuoteWise Quotation Context
 * Provides quotation state management across the app.
 * Currently uses mock data from mockData.js; will be replaced with Firebase Firestore.
 */

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { quotations as MOCK_QUOTATIONS } from '../services/mockData';

// --- Action Types ---
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  ACCEPT_QUOTATION: 'ACCEPT_QUOTATION',
  REJECT_QUOTATION: 'REJECT_QUOTATION',
  SAVE_QUOTATION: 'SAVE_QUOTATION',
  ADD_DRAFT: 'ADD_DRAFT',
  UPDATE_DRAFT: 'UPDATE_DRAFT',
  DELETE_DRAFT: 'DELETE_DRAFT',
  LOAD_DATA: 'LOAD_DATA',
};

// --- Reducer ---
function quotationReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ACTIONS.LOAD_DATA:
      return { ...state, quotations: action.payload, loading: false, error: null };
    case ACTIONS.ACCEPT_QUOTATION:
      return {
        ...state,
        quotations: state.quotations.map((q) =>
          q.id === action.payload ? { ...q, status: 'accepted' } : q
        ),
      };
    case ACTIONS.REJECT_QUOTATION:
      return {
        ...state,
        quotations: state.quotations.map((q) =>
          q.id === action.payload ? { ...q, status: 'rejected' } : q
        ),
      };
    case ACTIONS.SAVE_QUOTATION:
      return {
        ...state,
        quotations: state.quotations.map((q) =>
          q.id === action.payload ? { ...q, status: 'saved' } : q
        ),
      };
    case ACTIONS.ADD_DRAFT:
      return {
        ...state,
        quotations: [...state.quotations, { ...action.payload, id: `QT-${Date.now()}`, status: 'draft' }],
      };
    case ACTIONS.UPDATE_DRAFT:
      return {
        ...state,
        quotations: state.quotations.map((q) =>
          q.id === action.payload.id ? { ...q, ...action.payload.updates } : q
        ),
      };
    case ACTIONS.DELETE_DRAFT:
      return {
        ...state,
        quotations: state.quotations.filter((q) => q.id !== action.payload),
      };
    default:
      return state;
  }
}

// --- Context ---
const QuotationContext = createContext(null);

const initialState = {
  quotations: MOCK_QUOTATIONS,
  loading: false,
  error: null,
};

export function QuotationProvider({ children }) {
  const [state, dispatch] = useReducer(quotationReducer, initialState);

  const acceptQuotation = useCallback((id) => {
    dispatch({ type: ACTIONS.ACCEPT_QUOTATION, payload: id });
  }, []);

  const rejectQuotation = useCallback((id) => {
    dispatch({ type: ACTIONS.REJECT_QUOTATION, payload: id });
  }, []);

  const saveQuotation = useCallback((id) => {
    dispatch({ type: ACTIONS.SAVE_QUOTATION, payload: id });
  }, []);

  const addDraft = useCallback((draft) => {
    dispatch({ type: ACTIONS.ADD_DRAFT, payload: draft });
  }, []);

  const updateDraft = useCallback((id, updates) => {
    dispatch({ type: ACTIONS.UPDATE_DRAFT, payload: { id, updates } });
  }, []);

  const deleteDraft = useCallback((id) => {
    dispatch({ type: ACTIONS.DELETE_DRAFT, payload: id });
  }, []);

  // Derived data — memoized to avoid re-computing on every render
  const drafts = useMemo(
    () => state.quotations.filter((q) => q.status === 'draft'),
    [state.quotations]
  );
  const pendingQuotations = useMemo(
    () => state.quotations.filter((q) => q.status === 'pending'),
    [state.quotations]
  );
  const savedQuotations = useMemo(
    () => state.quotations.filter((q) => q.status === 'saved'),
    [state.quotations]
  );
  const activeQuotations = useMemo(
    () => state.quotations.filter((q) => q.status === 'pending' || q.status === 'draft'),
    [state.quotations]
  );

  // Context value — memoized to prevent cascade re-renders
  const value = useMemo(() => ({
    quotations: state.quotations,
    drafts,
    pendingQuotations,
    savedQuotations,
    activeQuotations,
    loading: state.loading,
    error: state.error,
    acceptQuotation,
    rejectQuotation,
    saveQuotation,
    addDraft,
    updateDraft,
    deleteDraft,
  }), [
    state.quotations, state.loading, state.error,
    drafts, pendingQuotations, savedQuotations, activeQuotations,
    acceptQuotation, rejectQuotation, saveQuotation,
    addDraft, updateDraft, deleteDraft,
  ]);

  return (
    <QuotationContext.Provider value={value}>
      {children}
    </QuotationContext.Provider>
  );
}

export function useQuotations() {
  const context = useContext(QuotationContext);
  if (!context) {
    throw new Error('useQuotations must be used within a QuotationProvider');
  }
  return context;
}

export default QuotationContext;
