import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import {
  getAllProduct,
  searchBySearchKey,
  searchByPrice,
  searchByCategory,
} from "../../action/product/product.js";
import { useSearchParams, useNavigate } from "react-router-dom";

import Product from "./product/Product.js";

import searchIcon from "../../assets/image/searchIcon.png";

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

const ProductList = () => {
  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchKeyP = searchParams?.get("searchKeyP");
  const minPriceP = searchParams?.get("minPriceP");
  const maxPriceP = searchParams?.get("maxPriceP");
  const categoryP = searchParams?.get("categoryP");
  const sortedDirectionP = searchParams?.get("sortedDirectionP");
  const sortedTermP = searchParams?.get("sortedTermP");
  const { register, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      searchKey: searchKeyP ? searchKeyP : "",
      categoryID: categoryP ? categoryP : "",
      minPrice: minPriceP ? minPriceP : 0,
      maxPrice: maxPriceP ? maxPriceP : "",
      sortedDirection: sortedDirectionP ? sortedDirectionP : "DESC",
      sortedTerm: sortedTermP ? sortedTermP : "created_at",
    },
  });
  const [product, setProduct] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [isFechtedEverything, setIsFechtedEverything] = useState(false);
  const [nextRequest, setNextRequest] = useState({
    nextId: 0,
    limit: 10,
    currentPage: 0,
    totalPages: 0,
  });
  const [searchKeyData, setSearchKeyData] = useState([]);
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
    if (searchKeyData?.length !== 0) {
      newData = searchKeyData;
    } else if (searchPriceData?.data?.length !== 0) {
      newData = searchPriceData?.data;
    } else if (searchCategoryData?.data?.length !== 0) {
      newData = searchCategoryData?.data;
    }
    if (
      searchKeyData?.length !== 0 &&
      searchPriceData?.data?.length !== 0 &&
      !searchCategoryData?.data.length !== 0
    ) {
      newData = mergeTwoDataWithoutDuplicate(
        searchKeyData,
        searchPriceData?.data
      );
    } else if (
      !searchKeyData?.length !== 0 &&
      searchPriceData?.data?.length !== 0 &&
      searchCategoryData?.data?.length !== 0
    ) {
      newData = mergeTwoDataWithoutDuplicate(
        searchPriceData?.data,
        searchCategoryData?.data
      );
    } else if (
      searchKeyData?.length !== 0 &&
      !searchPriceData?.data?.length !== 0 &&
      searchCategoryData?.data?.length !== 0
    ) {
      newData = mergeTwoDataWithoutDuplicate(
        searchKeyData,
        searchCategoryData?.data
      );
    }
    if (
      searchKeyData?.length !== 0 &&
      searchPriceData?.data?.length !== 0 &&
      searchCategoryData?.data?.length !== 0
    ) {
      newData = mergeTwoDataWithoutDuplicate(
        searchKeyData,
        searchCategoryData?.data
      );
      newData = mergeTwoDataWithoutDuplicate(newData, searchPriceData?.data);
    }
    return newData;
  }

  const handleAddMoreProduct = async () => {
    setIsLoading(true);
    await getAllProduct(nextRequest?.nextId, nextRequest?.limit).then(
      (data) => {
        setProduct([...product, ...data?.products]);
        setNextRequest({
          nextId: data?.nextId,
          limit: data?.limit,
        });
        setIsLoading(false);
        if (data?.totalProductCount === data?.nextId) {
          setIsFechtedEverything(true);
        }
      }
    );
  };
  useEffect(() => {
    async function getInitialData() {
      await getAllProduct(nextRequest?.nextId, nextRequest?.limit).then(
        (data) => {
          setProduct(data?.products);
          setNextRequest({
            nextId: data?.nextId,
            limit: data?.limit,
          });
        }
      );
    }

    if (!(searchKeyP || minPriceP || maxPriceP || categoryP)) {
      getInitialData();
    }
    // eslint-disable-next-line
  }, []);
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
    navigate(
      `/customer/search?searchKeyP=${e.searchKey}&sortedDirectionP1=${e.sortedDirection}&sortedTermP1=${e.sortedTerm}`
    );
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
          <div className="col-12 col-md-4 d-flex justtify-content-center align-items-center mt-md-3">
            <div className="col-12">
              <select
                id="fromWarehouse"
                type="number"
                className="form-select form-select-lg"
                {...register("categoryID", {
                  valueAsNumber: true,
                })}
                onChange={(e) => {
                  navigate(
                    `/customer/browse?categoryP=${
                      e.target.value
                    }&minPriceP=${getValues("minPrice")}&maxPriceP=${getValues(
                      "maxPrice"
                    )}&sortedDirectionP=${getValues(
                      "sortedDirection"
                    )}&sortedTermP=${getValues("sortedTerm")}`
                  );
                }}
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
        </form>
        <div className="my-4 d-flex flex-wrap flex-row justify-content-center align-items-center">
          {product?.map((item, index) => {
            return (
              <div key={index} className="">
                <Product info={item}></Product>
              </div>
            );
          })}
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
          {isloading && (
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
          {!isFechtedEverything && !isSearching && (
            <button
              type="button"
              className="btn btn-warning"
              onClick={() => handleAddMoreProduct()}
            >
              More products...
            </button>
          )}
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
