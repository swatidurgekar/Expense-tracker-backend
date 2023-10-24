const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  isPremiumUser: false,
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
  initialState: { expenses: [] },
  reducers: {
    setExpenses(state, action) {
      state.expenses = action.payload;
    },
  },
});

export const premiumActions = premiumSlice.actions;
export const premiumReducer = premiumSlice.reducer;
export const expenseActions = expenseSlice.actions;
export const expenseReducer = expenseSlice.reducer;
