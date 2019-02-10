export const initialState = {
  theme: null,
  rows: [],
  billingTreeRows: [],
  processedRows: [],
  processedColumns: [],
  filteredRows: [],
  selectedRows: [],
  columns: [],
  filterBy: "",
  filterText: ""
};

export const reducer = (state, action) => ({ ...state, ...action });
