import axios from "axios";
import { Catalog } from "../store/catalogsSlice";

const API_BASE_URL = "http://localhost:3005/catalogs";

export const addCatalog = async (data: Partial<Catalog>) => {
  try {
    const response = await axios.post(API_BASE_URL, data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to add catalog: " + error);
  }
};

export const updateCatalog = async (id: string, data: Partial<Catalog>) => {
  debugger;
  try {
    const response = await axios.patch(`${API_BASE_URL}/${id}`, data);
    debugger;
    return response.data;
  } catch (error) {
    throw new Error("Failed to update catalog: " + error);
  }
};

export const deleteCatalog = async (id: string) => {
  debugger;
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    debugger;
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete catalog: " + error);
  }
};

export const fetchCatalogs = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    debugger;
    return response.data.map((catalog: any) => ({
      ...catalog,
      id: catalog._id,
    }));
  } catch (error) {
    throw new Error("Failed to fetch catalogs: " + error);
  }
};
