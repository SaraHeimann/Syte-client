import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCatalogs as fetchCatalogsFromApi } from "../services/api";

export interface Catalog {
  id: string;
  name: string;
  vertical: string;
  isPrimary: boolean;
  locales: string[];
  indexedAt: string;
}

interface CatalogState {
  catalogs: Catalog[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: CatalogState = {
  catalogs: [],
  status: "idle",
};

export const fetchCatalogs = createAsyncThunk(
  "catalogs/fetchCatalogs",
  async () => {
    return await fetchCatalogsFromApi();
  }
);

const catalogsSlice = createSlice({
  name: "catalogs",
  initialState,
  reducers: {
    addCatalogToState(state, action) {
      debugger;
      state.catalogs.push(action.payload);
    },
    updateCatalogInState(state, action) {
      const updatedCatalog = action.payload;
      const index = state.catalogs.findIndex(
        (catalog) => catalog.id === updatedCatalog.id
      );
      if (index !== -1) {
        state.catalogs[index] = updatedCatalog;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalogs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCatalogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.catalogs = action.payload;
      })
      .addCase(fetchCatalogs.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { addCatalogToState, updateCatalogInState } =
  catalogsSlice.actions;
export default catalogsSlice.reducer;
