import axios from "axios";
import { Catalog } from "../store/catalogsSlice";

const API_BASE_URL = "http://localhost:3005/catalogs";

export const addCatalog = async (data: Partial<Catalog>) => {
  try {
    const response = await axios.post(API_BASE_URL, data);
    return { ...data, id: response.data._id };
  } catch (error) {
    throw new Error("Failed to add catalog: " + error);
  }
};

export const updateCatalog = async (id: string, data: Partial<Catalog>) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/${id}`, data);
    return { ...data, id: response.data._id };
  } catch (error) {
    throw new Error("Failed to update catalog: " + error);
  }
};

export const deleteCatalog = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete catalog: " + error);
  }
};

export const fetchCatalogs = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data.map((catalog: any) => ({
      ...catalog,
      id: catalog._id,
    }));
  } catch (error) {
    throw new Error("Failed to fetch catalogs: " + error);
  }
};

export const deleteMultipleCatalogs = async (ids: string[]) => {
  try {
    const response = await axios.delete(API_BASE_URL, {
      data: { ids },
      headers: { "Content-Type": "application/json" },
    });

    if (response.status !== 200) {
      throw new Error("Failed to delete catalogs");
    }
  } catch (error: any) {
    throw new Error(
      "Failed to delete catalogs: " +
        (error.response?.data?.message || error.message)
    );
  }
};
