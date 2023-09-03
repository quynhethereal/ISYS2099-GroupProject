import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { searchByCategory } from "../../action/product/product.js";
import { useSearchParams, useNavigate } from "react-router-dom";

import Product from "./product/Product.js";
import Dropdown from "react-bootstrap/Dropdown";
import CategorySubMenu from "../../utils/CategorySubMenu.js";
import "./ProductList.css";

const ProductListBrowse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryP = searchParams?.get("categoryP");
  const sortedDirectionP1 = searchParams?.get("sortedDirectionP1");
  const sortedTermP1 = searchParams?.get("sortedTermP1");
  const sortedDirectionP2 = searchParams?.get("sortedDirectionP2");
  const sortedTermP2 = searchParams?.get("sortedTermP2");
  const { register, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      categoryID: categoryP ? categoryP : "",
      sortedDirection1: sortedDirectionP1 ? sortedDirectionP1 : "DESC",
      sortedTerm1: sortedTermP1 ? sortedTermP1 : "",
      sortedDirection2: sortedDirectionP2 ? sortedDirectionP2 : "DESC",
      sortedTerm2: sortedTermP2 ? sortedTermP2 : "",
    },
  });
  const [isFechtedEverything, setIsFechtedEverything] = useState(false);
  const [searchCategoryData, setSearchCategoryData] = useState({
    currentPage: null,
    totalPages: null,
    limit: 10,
    data: [],
  });
  const [moreSearch, setMoreSearch] = useState(false);
  const [change, setChange] = useState({
    check1: getValues("sortedDirection1") === "DESC" ? false : true,
    check2: getValues("sortedDirection2") === "DESC" ? false : true,
  });
  const handleSetMoreSearch = () => {
    setMoreSearch((prev) => !prev);
  };
  const handleChangeDirection1 = () => {
    if (getValues("sortedDirection1") === "DESC") {
      setValue("sortedDirection1", "ASC");
    } else if (getValues("sortedDirection1") === "ASC") {
      setValue("sortedDirection1", "DESC");
    }
    setChange({ ...change, check1: !change?.check1 });
  };
  const handleChangeDirection2 = () => {
    if (getValues("sortedDirection2") === "DESC") {
      setValue("sortedDirection2", "ASC");
    } else if (getValues("sortedDirection2") === "ASC") {
      setValue("sortedDirection2", "DESC");
    }
    setChange({ ...change, check2: !change?.check2 });
  };

  //working for category
  useEffect(() => {
    if (
      !(
        searchCategoryData?.currentPage !== searchCategoryData?.totalPages ||
        searchCategoryData?.totalPages === null
      )
    ) {
      setIsFechtedEverything(true);
      return;
    }
    async function searchForCat() {
      //api
      await searchByCategory(
        categoryP,
        sortedTermP1 ? sortedDirectionP1 : "",
        sortedTermP1 || "",
        sortedTermP2 ? sortedDirectionP2 : "",
        sortedTermP2 || "",
        searchCategoryData?.limit,
        searchCategoryData?.currentPage
          ? searchCategoryData?.currentPage + 1
          : 1
      ).then((res) => {
        if (res?.products) {
          setSearchCategoryData({
            ...searchCategoryData,
            data: [...searchCategoryData?.data, ...res?.products],
            currentPage: res?.currentPage,
            totalPages: res?.totalPages,
          });
        }
      });
    }

    if (categoryP && parseInt(categoryP)) {
      if (
        searchCategoryData?.currentPage !== searchCategoryData?.totalPages ||
        searchCategoryData?.totalPages === null
      ) {
        searchForCat();
      }
    }
    // eslint-disable-next-line
  }, [moreSearch]);

  const handleSearchProduct = (e) => {
    console.log(e);
    setSearchParams(
      `?categoryP=${e.categoryID}&sortedDirectionP1=${e.sortedDirection1}&sortedTermP1=${e.sortedTerm1}&sortedDirectionP2=${e.sortedDirection2}&sortedTermP2=${e.sortedTerm2}`
    );
    navigate(0);
  };

  return (
    <>
      <div className="container">
        <form
          onSubmit={handleSubmit(handleSearchProduct)}
          className="my-4 d-flex flex-wrap flex-row justify-content-between align-items-center"
        >
          <div className="col-12 col-md-6 d-flex justtify-content-center align-items-center mt-md-3">
            <div className="col-12">
              {/* <select
                id="categoryID"
                type="number"
                className="form-select form-select-lg"
                {...register("categoryID", {
                  valueAsNumber: true,
                })}
              > */}

              {/* <option value="" disabled>
                  Select category
                </option>
                {testData?.map((category, index) => {
                  return (
                    <option value={category?.id} key={index}>
                      {category?.name}
                    </option>
                  );
                })}
              </select> */}
            </div>
          </div>
          <div className="col-12 col-md-6 d-flex justtify-content-center align-items-center">
            <div className="w-100 d-flex flex-column justify-content-center algin-items-center">
              <div className="col-12 d-flex flex-row flex-wrap justify-content-evenly align-items-center">
                <div className="col-6">
                  <select
                    id="fromWarehouse"
                    type="number"
                    className="form-select form-select-lg"
                    {...register("sortedTerm1", {})}
                  >
                    <option value="">None</option>
                    <option value="created_at">Create Date</option>
                  </select>
                </div>
                <div className="col-auto px-1">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={change?.check1}
                      id="direction"
                      onChange={() => {
                        handleChangeDirection1();
                      }}
                    />
                    <label className="form-check-label" htmlFor="direction">
                      Ascending
                    </label>
                  </div>
                </div>
                <div className="col-6">
                  <select
                    id="fromWarehouse"
                    type="number"
                    className="form-select form-select-lg"
                    {...register("sortedTerm2", {})}
                  >
                    <option value="">None</option>
                    <option value="price">Price</option>
                  </select>
                </div>
                <div className="col-auto px-1">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={change?.check2}
                      id="direction"
                      onChange={() => {
                        handleChangeDirection2();
                      }}
                    />
                    <label className="form-check-label" htmlFor="direction">
                      Ascending
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 my-4 d-flex flex-wrap flex-row justify-content-center align-items-center">
            <button type="submit" className="btn btn-success">
              Submit
            </button>
          </div>
        </form>
        <div className="my-4 d-flex flex-wrap flex-row justify-content-center align-items-center">
          {searchCategoryData?.data?.map((item, index) => {
            return (
              <div key={index} className="">
                <Product info={item}></Product>
              </div>
            );
          })}
          {searchCategoryData?.length === 0 && isFechtedEverything && (
            <div className="w-100 text-center fs-3 fw-bold">None was found</div>
          )}
        </div>
        <div className="my-4 d-flex justify-content-center algin-items-center">
          {!isFechtedEverything && searchCategoryData?.currentPage && (
            <button
              type="button"
              className="btn btn-warning"
              onClick={() => handleSetMoreSearch()}
            >
              More searching...
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductListBrowse;
