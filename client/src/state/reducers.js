export const initialState = {
  theme: null,
  rows: [],
  filteredRows: [],
  selectedRows: [],
  columns: [],
  filterBy: "",
  filterText: ""
};

export const reducer = (state, action) => ({ ...state, ...action });
