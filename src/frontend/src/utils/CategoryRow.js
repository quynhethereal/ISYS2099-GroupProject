import React, { useState } from "react";

import CategoryCreateForm from "./CategoryCreateForm";
import CategoryAttributeForm from "./CategoryAttributeForm";
import CategoryUpdateAttributeForm from "./CategoryUpdateAttributeForm";

const CategoryRow = ({ data, child }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [showAddAttribute, setShowAddAttribute] = useState(false);
  const [showUpdateAttribute, setShowUpdateAttribute] = useState(false);

  const handleShowCreateForm = () => {
    setShowCreate((prev) => !prev);
  };

  const handleShowAddAttributeForm = () => {
    setShowAddAttribute((prev) => !prev);
  };

  const handleShowUpdateAttributeForm = () => {
    setShowUpdateAttribute((prev) => !prev);
  };
  return (
    <div className="col-12 my-3">
      <div className="col-12 d-flex flex-row">
        <button
          className="btn btn-outline-success col-6"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#${data?.id}`}
        >
          {child && "Sub"}Category: {data?.name}
        </button>
        <div className="col-6 d-flex justify-content-end align-items-center">
          <button
            className="btn btn-info"
            onClick={() => handleShowCreateForm()}
          >
            Create
          </button>
          <button className="btn btn-warning ms-2">Update</button>
          <button className="btn btn-danger ms-2">Delete</button>
          <CategoryCreateForm
            data={data}
            show={showCreate}
            handleClose={handleShowCreateForm}
          />
          <CategoryAttributeForm
            data={data}
            show={showAddAttribute}
            handleClose={handleShowAddAttributeForm}
          />
          <CategoryUpdateAttributeForm
            data={data}
            show={showUpdateAttribute}
            handleClose={handleShowUpdateAttributeForm}
          />
        </div>
      </div>
      <div className="col-12 d-flex flex-row flex-wrap my-2 gap-1">
        {data?.attributes?.map((atr, index) => {
          return (
            <button
              type="button"
              className="btn btn-info p-0"
              key={index}
              onClick={() => handleShowUpdateAttributeForm()}
            >
              <span className="badge bg-info d-flex align-items-center justify-content-center">
                {atr?.name}
              </span>
            </button>
          );
        })}
        <button
          type="button"
          className="btn btn-info p-0"
          onClick={() => handleShowAddAttributeForm()}
        >
          <span className="badge bg-info"> + New Attribute </span>
        </button>
      </div>

      <div className="col-12">
        <div className="collapse" id={data?.id}>
          <div className="card card-body ps-3 py-0 pe-0">
            {data?.subcategories &&
              data?.subcategories?.map((subcategory) => {
                return (
                  <CategoryRow
                    data={subcategory}
                    child={true}
                    key={subcategory?.id}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryRow;
