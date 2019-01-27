import React, { useReducer } from "react";
import { reducer, initialState } from "./reducers";

export const Store = React.createContext();

export const Provider = ({ children }) => {
  const store = createStore(reducer, initialState);
  return <Store.Provider value={store}>{children}</Store.Provider>;
};

const createStore = (reducer, initialState) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
};
