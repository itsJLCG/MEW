import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./slices/sidebarSlice";
/* import brandReducer from './slices/brandSlice'; */

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
/*     brands: brandReducer, */
  },
});

