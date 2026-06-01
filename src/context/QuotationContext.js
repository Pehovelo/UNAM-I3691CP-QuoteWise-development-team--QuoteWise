/**
 * QuoteWise Quotation Context
 * Provides quotation state management across the app.
 * Currently uses mock data; will be replaced with Firebase Firestore.
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';

// --- Mock Data ---
const MOCK_QUOTATIONS = [
  {
    id: 'QT-001',
    title: 'Quotation from Imms Trading CC',
    supplier: 'Imms Trading CC',
    projectTitle: 'Head Office HVAC Installation',
    budget: 145500.00,
    currency: 'N$',
    description: 'Supply and installation of 5x 24000 BTU inverter split units for the main open-plan office space. Includes all copper piping, electrical connections to existing DB, and commissioning.',
    status: 'pending', // draft | pending | saved | accepted | rejected
    date: '2026-04-01',
    validUntil: '2026-05-01',
    referenceNumber: 'IMMS-0042',
  },
  {
    id: 'QT-002',
    title: 'Quotation from Imms Trading CC',
    supplier: 'Imms Trading CC',
    projectTitle: 'Warehouse Concrete Flooring',
    budget: 287000.00,
    currency: 'N$',
    description: 'Supply and laying of 500m² industrial concrete flooring with mesh reinforcement and power float finish. Includes site preparation and compaction.',
    status: 'pending',
    date: '2026-04-01',
    validUntil: '2026-05-01',
    referenceNumber: 'IMMS-0043',
  },
  {
    id: 'QT-003',
    title: 'Quotation from BuildMat Suppliers',
    supplier: 'BuildMat Suppliers',
    projectTitle: 'Office Renovation — Phase 2',
    budget: 92500.00,
    currency: 'N$',
    description: 'Supply of building materials for office renovation including drywall partitions, ceiling boards, paint, and electrical fittings as per BOQ.',
    status: 'draft',
    date: '2026-03-28',
    validUntil: '2026-04-28',
    referenceNumber: 'BM-0187',
  },
  {
    id: 'QT-004',
    title: 'Quotation from NamSteel Works',
    supplier: 'NamSteel Works',
    projectTitle: 'Structural Steel — Factory Extension',
    budget: 420000.00,
    currency: 'N$',
    description: 'Fabrication and erection of structural steel frame for 200m² factory extension. Includes all welding, bolting, and anti-corrosion treatment.',
    status: 'draft',
    date: '2026-03-15',
    validUntil: '2026-04-15',
    referenceNumber: 'NS-0452',
  },
  {
    id: 'QT-005',
    title: 'Quotation from Imms Trading CC',
    supplier: 'Imms Trading CC',
    projectTitle: 'Plumbing — Staff Kitchen Refit',
    budget: 38000.00,
    currency: 'N$',
    description: 'Complete plumbing installation for staff kitchen refit including hot water cylinder, sinks, and drainage.',
    status: 'saved',
    date: '2026-02-20',
    validUntil: '2026-03-20',
    referenceNumber: 'IMMS-0039',
  },
  {
    id: 'QT-006',
    title: 'Quotation from ElectraConnect',
    supplier: 'ElectraConnect',
    projectTitle: 'DB Upgrade & Reticulation',
    budget: 67500.00,
    currency: 'N$',
    description: 'Upgrade of main distribution board and reticulation for the new wing. Includes certificates of compliance.',
    status: 'saved',
    date: '2026-02-10',
    validUntil: '2026-03-10',
    referenceNumber: 'EC-0781',
  },
  {
    id: 'QT-007',
    title: 'Quotation from PaintPro Namibia',
    supplier: 'PaintPro Namibia',
    projectTitle: 'Exterior Painting — Admin Block',
    budget: 52000.00,
    currency: 'N$',
    description: 'Exterior painting of admin block including preparation, primer, and two coats of Plascon Nuroof.',
    status: 'accepted',
    date: '2026-01-15',
    validUntil: '2026-02-15',
    referenceNumber: 'PP-0234',
  },
  {
    id: 'QT-008',
    title: 'Quotation from GlassFit Windhoek',
    supplier: 'GlassFit Windhoek',
    projectTitle: 'Window Replacement — Boardroom',
    budget: 29000.00,
    currency: 'N$',
    description: 'Supply and installation of aluminum framed windows for boardroom. Includes removal of existing windows.',
    status: 'rejected',
    date: '2026-01-05',
    validUntil: '2026-02-05',
    referenceNumber: 'GF-0567',
  },
];

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

  // Derived data
  const drafts = state.quotations.filter((q) => q.status === 'draft');
  const pendingQuotations = state.quotations.filter((q) => q.status === 'pending');
  const savedQuotations = state.quotations.filter((q) => q.status === 'saved');
  const activeQuotations = state.quotations.filter(
    (q) => q.status === 'pending' || q.status === 'draft'
  );

  const value = {
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
  };

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
