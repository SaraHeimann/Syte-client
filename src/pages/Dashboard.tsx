import React, { useState } from "react";
import { CatalogTable } from "../comopnents/ CatalogTable";
import { CatalogForm } from "../comopnents/CatalogForm";

export const Dashboard: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const toggleForm = () => {
    setIsFormOpen((prev) => !prev);
  };

  return (
    <>
      <button onClick={toggleForm}>
        {isFormOpen ? "cancel" : "add catalog"}
      </button>
      {isFormOpen && <CatalogForm setIsOpen={setIsFormOpen} />}
      <CatalogTable />
    </>
  );
};
