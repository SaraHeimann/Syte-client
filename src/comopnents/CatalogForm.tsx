import { useDispatch } from "react-redux";
import {
  addCatalogToState,
  Catalog,
  updateCatalogInState,
} from "../store/catalogsSlice";
import { addCatalog, updateCatalog } from "../services/api";
import { useState } from "react";

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

  const validateName = (value: string): boolean => /^[a-zA-Z]+$/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateName(name)) {
      setError("Name must contain only letters and cannot be empty.");
      return;
    }

    const localesArray = locales
      .split(",")
      .map((locale: string) => locale.trim());

    try {
      if (existingCatalog) {
        const updatedCatalog = {
          name,
          vertical,
          locales: localesArray,
          isPrimary,
        };
        await updateCatalog(existingCatalog.id, updatedCatalog);
        dispatch(updateCatalogInState(updatedCatalog));
        alert("Catalog updated!");
      } else {
        const newCatalog = {
          name,
          vertical,
          locales: localesArray,
          isPrimary,
        };
        const response = await addCatalog(newCatalog);
        dispatch(addCatalogToState(response));
        alert("Catalog added!");
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
      />
      <select value={vertical} onChange={(e) => setVertical(e.target.value)}>
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

