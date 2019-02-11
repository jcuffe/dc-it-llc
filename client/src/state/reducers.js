export const initialState = {
  theme: null,
  rows: [],
  processed: {
    rows: [],
    columns: [],
    filteredRows: [],
    startDate: null,
    endDate: null
  },
  billingTreeRows: [],
  filteredRows: [],
  selectedRows: [],
  columns: [],
  filterBy: "",
  filterText: ""
};

export const reducer = (state, action) => ({ ...state, ...action });
