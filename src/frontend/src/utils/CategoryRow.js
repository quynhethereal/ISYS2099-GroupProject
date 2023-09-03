import React, { useState } from "react";

import CategoryCreateForm from "./CategoryCreateForm";
import CategoryUpdateForm from "./CategoryUpdateForm";
import CategoryAttributeForm from "./CategoryAttributeForm";

const CategoryRow = ({ data, child }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

  const handleShowCreateForm = () => {
    setShowCreate((prev) => !prev);
  };

  const handleShowUpdateForm = () => {
    setShowUpdate((prev) => !prev);
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
            Create subcategory
          </button>
          <button
            className="btn btn-warning ms-2"
            onClick={() => handleShowUpdateForm()}
          >
            Update
          </button>
          <button className="btn btn-danger ms-2">Delete</button>
          {showCreate && (
            <CategoryCreateForm
              data={data}
              show={showCreate}
              handleClose={handleShowCreateForm}
            />
          )}
          {showUpdate && (
            <CategoryUpdateForm
              data={data}
              show={showUpdate}
              handleClose={handleShowUpdateForm}
            />
          )}
        </div>
      </div>
      <div className="col-12 d-flex flex-row flex-wrap my-2 gap-1">
        {data?.attributes?.map((atr, index) => {
          return <CategoryAttributeForm key={index} data={atr} />;
        })}
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
