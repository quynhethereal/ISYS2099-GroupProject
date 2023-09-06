import React, { useEffect, useState } from "react";

import { getAllCategory } from "../../action/category/category";

import CategoryRow from "../../utils/CategoryRow.js";
import CategoryCreateForm from "../../utils/CategoryCreateForm.js";

const Category = () => {
  const [data, setData] = useState([]);

  const [show, setShow] = useState(false);

  const handleShowModal = () => {
    setShow((prev) => !prev);
  };

  useEffect(() => {
    async function getInitialData() {
      await getAllCategory().then((res) => {
        if (res) {
          setData(res);
        }
      });
    }
    getInitialData();
  }, []);

  return (
    <div className="container m-md-4">
      <div className="col-12 d-flex flex-row">
        <p className="text-start text-primary fw-bolder fs-3"> Category List</p>
        <button
          className="ms-auto btn btn-primary"
          onClick={() => handleShowModal()}
        >
          Create category
        </button>
      </div>
      <CategoryCreateForm show={show} handleClose={handleShowModal} />
      {data?.map((parent, index) => {
        return <CategoryRow data={parent} key={parent?.id} parent={true} />;
      })}
    </div>
  );
};

export default Category;
