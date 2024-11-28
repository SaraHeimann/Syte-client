import { useDispatch, useSelector } from "react-redux";
import {
  addCatalogToState,
  Catalog,
  updateCatalogInState,
} from "../store/catalogsSlice";
import { useState } from "react";
import { addCatalog, updateCatalog } from "../services/api";

export const CatalogForm: React.FC<{
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  existingCatalog?: Catalog | null;
}> = ({ setIsOpen, existingCatalog }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState(existingCatalog?.name || "");
  const [vertical, setVertical] = useState(
    existingCatalog?.vertical || "fashion"
  );
  const [locales, setLocales] = useState(
    existingCatalog?.locales?.join(", ") || ""
  );
  const [isPrimary, setIsPrimary] = useState(
    existingCatalog?.isPrimary || false
  );
  const [error, setError] = useState<string | null>(null);

  const catalogs = useSelector((state: any) => state.catalogs.catalogs); // ייבוא קטלוגים מ-Redux

  const validateName = (value: string): boolean => /^[a-zA-Z]+$/.test(value);

  const handleUpdateCatalog = async (
    existingCatalog: Catalog,
    updatedData: Partial<Catalog>
  ) => {
    if (updatedData.isPrimary) {
      const existingPrimary = catalogs.find(
        (catalog: Catalog) =>
          catalog.vertical === existingCatalog.vertical && catalog.isPrimary
      );
      if (existingPrimary && existingPrimary.id !== existingCatalog.id) {
        const previousCatalogResponse = await updateCatalog(
          existingPrimary.id,
          { isPrimary: false }
        );
        dispatch(updateCatalogInState(previousCatalogResponse));
      }
    }

    const response = await updateCatalog(existingCatalog.id, updatedData);
    dispatch(updateCatalogInState(response));
    alert("Catalog updated!");
  };

  const handleAddCatalog = async (newData: Partial<Catalog>) => {
    if (newData.isPrimary) {
      const existingPrimary = catalogs.find(
        (catalog: Catalog) =>
          catalog.vertical === newData.vertical && catalog.isPrimary
      );

      if (existingPrimary) {
        const previousCatalogResponse = await updateCatalog(
          existingPrimary.id,
          { isPrimary: false }
        );
        dispatch(updateCatalogInState(previousCatalogResponse));
      }
    }

    const response = await addCatalog(newData);
    dispatch(addCatalogToState(response));
    alert("Catalog added!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateName(name)) {
      setError("Name must contain only letters and cannot be empty.");
      return;
    }

    const localesArray = locales
      .split(",")
      .map((locale: string) => locale.trim());

    const catalogData = {
      name,
      vertical,
      locales: localesArray,
      isPrimary,
    };

    try {
      if (existingCatalog) {
        await handleUpdateCatalog(existingCatalog, catalogData);
      } else {
        await handleAddCatalog(catalogData);
      }
      setIsOpen(false);
    } catch (err) {
      console.error("Error submitting catalog:", err);
      setError("An error occurred. Please try again." + err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => {
          const value = e.target.value;
          setName(value);
          if (!validateName(value)) {
            setError("Name must contain only letters and cannot be empty.");
          } else {
            setError(null);
          }
        }}
        required
        disabled={!!existingCatalog} // disable אם מדובר בעדכון
      />
      <select
        value={vertical}
        onChange={(e) => setVertical(e.target.value)}
        disabled={!!existingCatalog} // disable אם מדובר בעדכון
      >
        <option value="fashion">Fashion</option>
        <option value="home">Home</option>
        <option value="general">General</option>
      </select>
      <input
        type="text"
        placeholder="Locales (comma-separated)"
        value={locales}
        onChange={(e) => setLocales(e.target.value)}
      />
      <label>
        Primary:
        <input
          type="checkbox"
          checked={isPrimary}
          onChange={(e) => setIsPrimary(e.target.checked)}
        />
      </label>
      <button type="submit" disabled={!!error}>
        {existingCatalog ? "Update Catalog" : "Add Catalog"}
      </button>
    </form>
  );
};
