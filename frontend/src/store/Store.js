import { configureStore } from "@reduxjs/toolkit";
import portfolioReducer from "./PortfolioSlice";

export const store = configureStore({
  reducer: {
    portfolio: portfolioReducer
  }
});