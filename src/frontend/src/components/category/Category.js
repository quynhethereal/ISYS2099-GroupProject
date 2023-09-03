import React, { useEffect, useState } from "react";

import { getAllCategory } from "../../action/category/category";

import CategoryRow from "../../utils/CategoryRow.js";

const Category = () => {
  const [data, setData] = useState([]);

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
      <div className="col-12 text-start text-primary fw-bolder fs-3">
        Category List
      </div>
      {data?.map((parent, index) => {
        return <CategoryRow data={parent} key={parent?.id} />;
      })}
    </div>
  );
};

export default Category;
