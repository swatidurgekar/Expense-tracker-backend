import { configureStore } from "@reduxjs/toolkit";
import { expenseReducer, premiumReducer } from "./Premium";

const store = configureStore({
  reducer: { premium: premiumReducer, expense: expenseReducer },
});

export default store;
