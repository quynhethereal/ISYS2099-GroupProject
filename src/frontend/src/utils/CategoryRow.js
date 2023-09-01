import React from "react";

// import AttributeRow from "./AttributeRow.js";

const CategoryRow = ({ data, child }) => {
  return (
    <div className="col-12 my-3">
      <div className="col-12 d-flex flex-row">
        <button
          className="btn btn-primary col-6"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#${data?.id}`}
        >
          {child && "Sub"}Category: {data?.name}
        </button>
        <div className="col-6 d-flex justify-content-end align-items-center">
          <button className="btn btn-info">Create</button>
          <button className="btn btn-warning ms-2">Update</button>
          <button className="btn btn-danger ms-2">Delete</button>
        </div>
      </div>

      <div className="col-12">
        <div className="collapse" id={data?.id}>
          <div className="card card-body ps-3 py-0 pe-0">
            {data?.child && <CategoryRow data={data?.child} child={true} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryRow;
