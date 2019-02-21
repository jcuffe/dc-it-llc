export const initialState = {
  theme: null,
  rows: [],
  customer: {
    rows: [],
    columns: []
  },
  processed: {
    rows: [],
    columns: [],
    filteredRows: [],
    startDate: null,
    endDate: null
  },
  billingTree: {
    rows: []
  },
  filteredRows: [],
  selectedRows: [],
  columns: [],
  filterBy: "",
  filterText: ""
};

export const reducer = (state, action) => ({ ...state, ...action });
