const { createSlice } = require("@reduxjs/toolkit");
const rows = localStorage.getItem("rows");

const initialState = {
  isPremiumUser: false,
  expenses: [],
  pages: 0,
  page: 1,
  rows: rows ? rows : 10,
};

const premiumSlice = createSlice({
  name: "premium",
  initialState,
  reducers: {
    setPremium(state, action) {
      state.isPremiumUser = action.payload;
    },
  },
});

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    setExpenses(state, action) {
      state.expenses = action.payload;
    },
    setPages(state, action) {
      state.pages = action.payload;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setRows(state, action) {
      state.rows = action.payload;
    },
  },
});

export const premiumActions = premiumSlice.actions;
export const premiumReducer = premiumSlice.reducer;
export const expenseActions = expenseSlice.actions;
export const expenseReducer = expenseSlice.reducer;
