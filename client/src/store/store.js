import { configureStore } from "@reduxjs/toolkit";
import { expenseReducer, loginReducer, premiumReducer } from "./Premium";

const store = configureStore({
  reducer: {
    premium: premiumReducer,
    login: loginReducer,
    expense: expenseReducer,
  },
});

export default store;
