import { useDispatch, useSelector } from "react-redux";
import { CatalogForm } from "./CatalogForm";
import { useState, useEffect } from "react";
import { deleteCatalog, deleteMultipleCatalogs } from "../services/api";
import { AppDispatch, RootState } from "../store";
import { Catalog, fetchCatalogs } from "../store/catalogsSlice";

export const CatalogTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedCatalog, setSelectedCatalog] = useState<Catalog | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCatalogs, setSelectedCatalogs] = useState<string[]>([]);

  const { catalogs, status } = useSelector(
    (state: RootState) => state.catalogs
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCatalogs());
    }
  }, [status, dispatch]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this catalog?")) {
      await deleteCatalog(id);
      dispatch(fetchCatalogs());
    }
  };

  const handleUpdate = (catalog: Catalog) => {
    setSelectedCatalog(catalog);
    setIsFormOpen(true);
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "failed") {
    return <p>Failed to load catalogs.</p>;
  }

  const toggleCatalogSelection = (id: string) => {
    setSelectedCatalogs((prev) =>
      prev.includes(id)
        ? prev.filter((catalogId) => catalogId !== id)
        : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (
      selectedCatalogs.length > 0 &&
      window.confirm("Are you sure you want to delete the selected catalogs?")
    ) {
      await deleteMultipleCatalogs(selectedCatalogs);
      setSelectedCatalogs([]);
      dispatch(fetchCatalogs());
    }
  };

  return (
    <div>
      {isFormOpen && (
        <CatalogForm
          setIsOpen={setIsFormOpen}
          existingCatalog={selectedCatalog}
        />
      )}
      <table>
        <thead>
          <tr key="header">
            <th> </th>
            <th>Name</th>
            <th>Vertical</th>
            <th>Primary</th>
            <th>Multi Locales</th>
            <th>Last Indexed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {catalogs.map((catalog) => (
            <tr key={catalog.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedCatalogs.includes(catalog.id)}
                  onChange={() => toggleCatalogSelection(catalog.id)}
                />
              </td>
              <td>{catalog.name}</td>
              <td>{catalog.vertical}</td>
              <td>{catalog.isPrimary ? "Yes" : "No"}</td>
              <td>{catalog.locales?.length > 1 ? "yes" : "no"}</td>
              <td>{new Date(catalog.indexedAt).toLocaleString()}</td>
              <td>
                <button onClick={() => handleUpdate(catalog)}>Edit</button>
                <button onClick={() => handleDelete(catalog.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleDeleteSelected}
        disabled={selectedCatalogs.length === 0}
      >
        Delete Selected
      </button>
    </div>
  );
};
