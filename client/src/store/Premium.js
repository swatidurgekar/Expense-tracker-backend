const { createSlice } = require("@reduxjs/toolkit");
const rows = localStorage.getItem("rows");
const token = localStorage.getItem("token");

const loginSlice = createSlice({
  name: "login",
  initialState: { isLoggedIn: !!token },
  reducers: {
    setLogin(state) {
      state.isLoggedIn = true;
    },
    setLogout(state) {
      state.isLoggedIn = false;
    },
  },
});

const premiumSlice = createSlice({
  name: "premium",
  initialState: { isPremiumUser: false },
  reducers: {
    setPremium(state, action) {
      state.isPremiumUser = action.payload;
    },
  },
});

const expenseSlice = createSlice({
  name: "expense",
  initialState: {
    expenses: [],
    pages: 0,
    page: 1,
    rows: rows ? rows : 10,
  },
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
export const loginActions = loginSlice.actions;
export const loginReducer = loginSlice.reducer;
