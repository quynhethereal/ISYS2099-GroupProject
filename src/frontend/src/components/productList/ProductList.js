import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { getAllProduct } from "../../action/product/product.js";
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
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      searchKey: searchKeyP ? searchKeyP : "",
      categoryID: categoryP ? categoryP : "",
      minPrice: minPriceP ? minPriceP : 0,
      maxPrice: "",
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
  const [focus, setFocus] = useState(false);

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

  const handleSearchProduct = (e) => {
    navigate(`/customer/search?searchKeyP=${e.searchKey}`);
  };

  const handleFilterByPrice = () => {
    if (!getValues("maxPrice")) {
      setFocus(true);
    } else {
      navigate(
        `/customer/price?minPrice=${getValues("minPrice")}&maxPrice=${getValues(
          "maxPrice"
        )}`
      );
    }
  };

  const handleFilterByCategory = (e) => {
    navigate(`/customer/browse?categoryP=${e.target.value}`);
  };

  console.log(errors);
  return (
    <>
      <div className="container">
        <form
          onSubmit={handleSubmit(handleSearchProduct)}
          className="my-4 d-flex flex-wrap flex-row justify-content-between align-items-center"
        >
          <div className="col-12 col-md-6 d-flex justtify-content-center align-items-center">
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
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row justtify-content-center align-items-center px-3 my-3 my-md-0 gap-0 gap-md-2 gap-lg-3">
            <div className="col-12 col-md-5">
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
            </div>
            <div className="col-12 col-md-5">
              <label htmlFor="quantity">Max</label>
              <input
                id="quantity"
                className="form-control"
                type="number"
                min="0"
                autoFocus={focus}
                {...register("maxPrice", {
                  require: "This is require before searching",
                })}
              />
            </div>
            <div className="">
              <button
                type="button"
                className="btn btn-success"
                onClick={() => handleFilterByPrice()}
              >
                Apply
              </button>
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
                  handleFilterByCategory(e);
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
        </div>
        <div className="my-4 d-flex justify-content-center algin-items-center">
          {isloading && (
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
          {!isFechtedEverything && (
            <button
              type="button"
              className="btn btn-warning"
              onClick={() => handleAddMoreProduct()}
            >
              More products...
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductList;
