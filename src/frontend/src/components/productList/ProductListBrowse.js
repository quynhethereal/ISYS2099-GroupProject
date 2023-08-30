import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import {
  searchByPrice,
  searchByCategory,
} from "../../action/product/product.js";
import { useSearchParams, useNavigate } from "react-router-dom";

import Product from "./product/Product.js";

var testData = [
  {
    _id: "64e234d2e360f233a9c99ad5",
    id: 1,
    name: "Clothing and Accessories",
    attributes: [],
    parent: 2,
    __v: 0,
  },
  {
    _id: "64e234d2e360f233a9c99ad6",
    id: 2,
    name: "Electronics and Gadgets",
    attributes: [],
    __v: 0,
  },
  {
    _id: "64e234d2e360f233a9c99ad7",
    id: 3,
    name: "Home and Kitchen Appliances",
    attributes: [],
    parent: 1,
    __v: 0,
  },
  {
    _id: "64e234d2e360f233a9c99ad8",
    id: 4,
    name: "Beauty and Personal Care",
    attributes: [],
    __v: 0,
  },
  {
    _id: "64e234d2e360f233a9c99ad9",
    id: 5,
    name: "Books, Music, and Movies",
    attributes: [],
    __v: 0,
  },
  {
    _id: "64e23ac7a11f741d717017e0",
    id: 21,
    name: "Instruments",
    attributes: ["Entertaining", "Music"],
    parent: 5,
    __v: 0,
  },
];

const ProductListBrowse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const minPriceP = searchParams?.get("minPriceP");
  const maxPriceP = searchParams?.get("maxPriceP");
  const categoryP = searchParams?.get("categoryP");
  const sortedDirectionP = searchParams?.get("sortedDirectionP");
  const sortedTermP = searchParams?.get("sortedTermP");
  const { register, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      categoryID: categoryP ? categoryP : "",
      minPrice: minPriceP ? minPriceP : 0,
      maxPrice: maxPriceP ? maxPriceP : "",
      sortedDirection: sortedDirectionP ? sortedDirectionP : "DESC",
      sortedTerm: sortedTermP ? sortedTermP : "created_at",
    },
  });
  //   const [isloading, setIsLoading] = useState(false);
  const [isFechtedEverything, setIsFechtedEverything] = useState(false);
  const [searchCategoryData, setSearchCategoryData] = useState({
    currentPage: null,
    totalPages: null,
    litmit: 10,
    data: [],
  });
  const [searchPriceData, setSearchPriceData] = useState({
    currentPage: null,
    totalPages: null,
    litmit: 10,
    data: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const [moreSearch, setMoreSearch] = useState(false);
  const handleSetMoreSearch = () => {
    setMoreSearch((prev) => !prev);
  };
  const handleChangeDirection = () => {
    if (getValues("sortedDirection") === "DESC") {
      setValue("sortedDirection", "ASC");
    } else if (getValues("sortedDirection") === "ASC") {
      setValue("sortedDirection", "DESC");
    }
  };

  function mergeTwoDataWithoutDuplicate(array1, array2) {
    var ids1 = new Set(array1?.map((product) => product?.id));
    var merged = [...array2.filter((item) => ids1.has(item?.id))];
    return merged;
  }

  function mergeAllData() {
    var newData = [];
    if (searchPriceData?.data?.length !== 0) {
      newData = searchPriceData?.data;
    } else if (searchCategoryData?.data?.length !== 0) {
      newData = searchCategoryData?.data;
    }

    if (
      searchCategoryData?.data?.length !== 0 &&
      searchPriceData?.data?.length !== 0
    ) {
      newData = mergeTwoDataWithoutDuplicate(
        searchCategoryData?.data,
        searchPriceData?.data
      );
    }
    return newData;
  }

  useEffect(() => {
    if (
      !(
        searchPriceData?.currentPage !== searchPriceData?.totalPages ||
        searchPriceData?.totalPages === null
      )
    ) {
      setIsFechtedEverything(true);
      return;
    }
    async function searchForMinAndMax() {
      await searchByPrice(
        minPriceP,
        maxPriceP,
        sortedDirectionP,
        sortedTermP,
        searchPriceData?.limit,
        searchPriceData?.currentPage ? searchPriceData?.currentPage + 1 : 1
      ).then((res) => {
        if (res?.products) {
          setSearchPriceData({
            ...searchPriceData,
            data: [...searchPriceData?.data, ...res?.products],
            currentPage: res?.currentPage,
            totalPages: res?.totalPages,
          });
        }
      });
    }
    if (minPriceP && maxPriceP && maxPriceP !== "NaN") {
      if (
        searchPriceData?.currentPage !== searchPriceData?.totalPages ||
        searchPriceData?.totalPages === null
      ) {
        searchForMinAndMax();
        setIsSearching(true);
      }
    }
    // eslint-disable-next-line
  }, [moreSearch]);

  //working for category
  useEffect(() => {
    async function searchForCat() {
      //api
      await searchByCategory(
        categoryP,
        sortedDirectionP,
        sortedTermP,
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
        setIsSearching(true);
      }
    }
    // eslint-disable-next-line
  }, [moreSearch]);

  const handleSearchProduct = (e) => {
    console.log(e);
    setSearchParams(
      `?categoryP=${e.categoryID}&minPriceP=${e.minPrice}&maxPriceP=${e.maxPrice}&sortedDirectionP=${e.sortedDirection}&sortedTermP=${e.sortedTerm}`
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
          <div className="col-12 col-md-4 d-flex justtify-content-center align-items-center mt-md-3">
            <div className="col-12">
              <select
                id="categoryID"
                type="number"
                className="form-select form-select-lg"
                {...register("categoryID", {
                  valueAsNumber: true,
                })}
              >
                <option value="" disabled>
                  Select category
                </option>
                {testData?.map((category, index) => {
                  return (
                    <option value={category?.id} key={index}>
                      {category?.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="col-12 col-md-4 d-flex flex-column flex-md-row justtify-content-center align-items-center px-3 my-3 my-md-0 gap-0 gap-md-2 gap-lg-3">
            <div className="col-12 col-md-6">
              <label htmlFor="quantity">Min</label>
              <input
                id="quantity"
                className="form-control"
                type="number"
                min="0"
                {...register("minPrice", {
                  valueAsNumber: "This must be a number",
                })}
              />
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="quantity">Max</label>
              <input
                id="quantity"
                className="form-control"
                type="number"
                min="0"
                {...register("maxPrice", {
                  valueAsNumber: "This must be a number",
                })}
              />
            </div>
          </div>
          <div className="col-12 col-md-4 d-flex justtify-content-center align-items-center">
            <div className="w-100 d-flex flex-column justify-content-center algin-items-center">
              <div className="col-12 d-flex flex-row flex-wrap justify-content-evenly align-items-center">
                <div className="col-6">
                  <select
                    id="sortedTerm"
                    type="number"
                    className="form-select form-select-lg"
                    {...register("sortedTerm", {})}
                  >
                    <option value="created_at">Create Date</option>
                    <option value="price">Price</option>
                  </select>
                </div>
                <div className="col-auto px-1">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="direction"
                      onChange={() => {
                        handleChangeDirection();
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
              Searching ...
            </button>
          </div>
        </form>
        <div className="my-4 d-flex flex-wrap flex-row justify-content-center align-items-center">
          {mergeAllData()?.map((item, index) => {
            return (
              <div key={index} className="">
                <Product info={item}></Product>
              </div>
            );
          })}
          {mergeAllData()?.length === 0 && isSearching && (
            <div className="w-100 text-center fs-3 fw-bold">None was found</div>
          )}
        </div>
        <div className="my-4 d-flex justify-content-center algin-items-center">
          {!isFechtedEverything && searchByPrice && isSearching && (
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
