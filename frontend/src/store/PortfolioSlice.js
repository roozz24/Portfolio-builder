import { createSlice } from "@reduxjs/toolkit";
import defaultPortfolio from "../utils/Portfolio";

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState: defaultPortfolio,
  reducers: {
    setPortfolio: (state, action) => {
      return action.payload;
    },
    updateSection: (state, action) => {
      const { id, data } = action.payload;

      if(id === "sections") {
        state.sections = data;
        return;
      }

      const section = state.sections.find(sec => sec.id === id);
      if (section) {
        section.data = data;
      }
    }
  }
});

export const { setPortfolio, updateSection } = portfolioSlice.actions;
export default portfolioSlice.reducer;