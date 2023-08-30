import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import {
  searchBySearchKey,
  searchByPrice,
} from "../../action/product/product.js";
import { useSearchParams, useNavigate } from "react-router-dom";

import Product from "./product/Product.js";

import searchIcon from "../../assets/image/searchIcon.png";

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchKeyP = searchParams?.get("searchKeyP");
  const minPriceP = searchParams?.get("minPriceP");
  const maxPriceP = searchParams?.get("maxPriceP");
  const sortedDirectionP = searchParams?.get("sortedDirectionP");
  const sortedTermP = searchParams?.get("sortedTermP");
  const { register, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      searchKey: searchKeyP ? searchKeyP : "",
      minPrice: minPriceP ? minPriceP : 0,
      maxPrice: maxPriceP ? maxPriceP : "",
      sortedDirection: sortedDirectionP ? sortedDirectionP : "DESC",
      sortedTerm: sortedTermP ? sortedTermP : "created_at",
    },
  });
  const [isFechtedEverything, setIsFechtedEverything] = useState(false);
  const [searchKeyData, setSearchKeyData] = useState([]);
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
    } else if (searchKeyData?.length !== 0) {
      newData = searchKeyData;
    }

    if (searchKeyData?.length !== 0 && searchPriceData?.data?.length !== 0) {
      newData = mergeTwoDataWithoutDuplicate(
        searchKeyData,
        searchPriceData?.data
      );
    }
    return newData;
  }
  useEffect(() => {
    async function searchForDesAndTile() {
      //api
      await searchBySearchKey(searchKeyP, sortedDirectionP, sortedTermP).then(
        (res) => {
          if (res?.products) {
            setSearchKeyData(res?.products);
          }
        }
      );
    }

    if (searchKeyP) {
      searchForDesAndTile();
      setIsSearching(true);
    }
    // eslint-disable-next-line
  }, []);

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

  const handleSearchProduct = (e) => {
    setSearchParams(
      `?searchKeyP=${e.searchKey}&categoryP=${e.categoryID}&minPriceP=${e.minPrice}&maxPriceP=${e.maxPrice}&sortedDirectionP=${e.sortedDirection}&sortedTermP=${e.sortedTerm}`
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
          <div className="col-12 col-md-4 d-flex justtify-content-center align-items-center">
            <div className="w-100 input-group d-flex justify-content-center algin-items-center">
              <input
                type="text"
                className="form-control rounded-start"
                placeholder="Search product title and description"
                style={{ background: "#f0f0f0" }}
                {...register("searchKey", {})}
              />
              <span className="input-group-append rounded-end">
                <button className="btn btn-warning" type="submit">
                  <img
                    src={searchIcon}
                    alt="search logo"
                    style={{ width: "36px", height: "36px" }}
                  />
                </button>
              </span>
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
                    id="fromWarehouse"
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
                      checked={
                        getValues("sortedDirectionP") === "DESC" ? false : true
                      }
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

export default ProductList;
