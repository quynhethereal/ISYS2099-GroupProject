import React from "react";

import AttributeRow from "./AttributeRow.js";

const CategoryRow = ({ data }) => {
  console.log(data);
  return (
    <>
      <p>
        <button
          className="btn btn-primary"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#${data?.id}`}
        >
          Category: {data?.name}
        </button>
      </p>
      <div className="col">
        <div className="collapse" id={data?.id}>
          <div className="card card-body">
            {data?.child && <CategoryRow data={data?.child} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryRow;
