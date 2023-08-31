import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { searchByPrice } from "../../action/product/product.js";
import { useSearchParams, useNavigate } from "react-router-dom";

import Product from "./product/Product.js";

const ProductListBrowse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const minPriceP = searchParams?.get("minPriceP");
  const maxPriceP = searchParams?.get("maxPriceP");
  const sortedDirectionP1 = searchParams?.get("sortedDirectionP1");
  const sortedTermP1 = searchParams?.get("sortedTermP1");
  const sortedDirectionP2 = searchParams?.get("sortedDirectionP2");
  const sortedTermP2 = searchParams?.get("sortedTermP2");
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      minPrice: minPriceP ? minPriceP : 0,
      maxPrice: maxPriceP ? maxPriceP : "",
      sortedDirection1: sortedDirectionP1 ? sortedDirectionP1 : "DESC",
      sortedTerm1: sortedTermP1 ? sortedTermP1 : "",
      sortedDirection2: sortedDirectionP2 ? sortedDirectionP2 : "DESC",
      sortedTerm2: sortedTermP2 ? sortedTermP2 : "",
    },
  });
  //   const [isloading, setIsLoading] = useState(false);
  const [isFechtedEverything, setIsFechtedEverything] = useState(false);
  const [searchPriceData, setSearchPriceData] = useState({
    currentPage: null,
    totalPages: null,
    litmit: 10,
    data: [],
  });
  const [moreSearch, setMoreSearch] = useState(false);
  const handleSetMoreSearch = () => {
    setMoreSearch((prev) => !prev);
  };
  const handleChangeDirection1 = () => {
    if (getValues("sortedDirection1") === "DESC") {
      setValue("sortedDirection1", "ASC");
    } else if (getValues("sortedDirection1") === "ASC") {
      setValue("sortedDirection1", "DESC");
    }
  };
  const handleChangeDirection2 = () => {
    if (getValues("sortedDirection2") === "DESC") {
      setValue("sortedDirection2", "ASC");
    } else if (getValues("sortedDirection2") === "ASC") {
      setValue("sortedDirection2", "DESC");
    }
  };

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
        sortedDirectionP1,
        sortedTermP1,
        sortedDirectionP2,
        sortedTermP2,
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
      }
    }
    // eslint-disable-next-line
  }, [moreSearch]);

  const handleSearchProduct = (e) => {
    console.log(e);
    setSearchParams(
      `?minPriceP=${e.minPrice}&maxPriceP=${e.maxPrice}&sortedDirectionP1=${e.sortedDirection1}&sortedTermP1=${e.sortedTerm1}&sortedDirectionP2=${e.sortedDirection2}&sortedTermP2=${e.sortedTerm2}`
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
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row justtify-content-center align-items-center px-3 my-3 my-md-0 gap-0 gap-md-2 gap-lg-3">
            <div className="col-12 col-md-6">
              <label htmlFor="quantity">Min</label>
              <input
                id="quantity"
                className="form-control"
                type="number"
                min="0"
                {...register("minPrice", {
                  require: "This is require before searching",
                })}
              />
              <p className="text-danger fw-bold">
                {errors?.minPrice && errors?.minPrice?.message}
              </p>
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="quantity">Max</label>
              <input
                id="quantity"
                className="form-control"
                type="number"
                min="0"
                {...register("maxPrice", {
                  require: "This is require before searching",
                })}
              />
              <p className="text-danger fw-bold">
                {errors?.maxPrice && errors?.maxPrice?.message}
              </p>
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
                    <option value="" disabled>
                      None was selected
                    </option>
                    <option value="created_at">Create Date</option>
                  </select>
                </div>
                <div className="col-auto px-1">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={
                        getValues("sortedDirectionP1") === "DESC" ? true : false
                      }
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
                    <option value="" disabled>
                      None was selected
                    </option>
                    <option value="price">Price</option>
                  </select>
                </div>
                <div className="col-auto px-1">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={
                        getValues("sortedDirectionP2") === "DESC" ? true : false
                      }
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
              Searching ...
            </button>
          </div>
        </form>
        <div className="my-4 d-flex flex-wrap flex-row justify-content-center align-items-center">
          {searchPriceData?.data?.map((item, index) => {
            return (
              <div key={index} className="">
                <Product info={item}></Product>
              </div>
            );
          })}
          {searchPriceData?.length === 0 && isFechtedEverything && (
            <div className="w-100 text-center fs-3 fw-bold">None was found</div>
          )}
        </div>
        <div className="my-4 d-flex justify-content-center algin-items-center">
          {!isFechtedEverything && searchPriceData?.currentPage && (
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
