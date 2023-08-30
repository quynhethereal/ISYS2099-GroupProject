import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { getAllProduct } from "../../action/product/product.js";
import { useParams, useNavigate } from "react-router-dom";

import Product from "./product/Product.js";

import searchIcon from "../../assets/image/searchIcon.png";

const ProductList = () => {
  const navigate = useNavigate();
  const { searchKeyP, minPriceP, maxPriceP, sortedDirectionP, sortedTermP } =
    useParams();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      searchKey: searchKeyP ? searchKeyP : "",
      minPrice: minPriceP ? minPriceP : "",
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
  });
  const handleChangeDirection = () => {
    if (getValues("sortedDirection") === "DESC") {
      setValue("sortedDirection", "ASC");
    } else if (getValues("sortedDirection") === "ASC") {
      setValue("sortedDirection", "DESC");
    }
  };

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
    if (
      !(searchKeyP || minPriceP || maxPriceP || sortedDirectionP || sortedTermP)
    ) {
      getInitialData();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    async function searchForDesAndTile() {
      console.log("search params", searchKeyP);
      //api
      searchForDesAndTile();
    }

    if (searchKeyP) {
      searchForDesAndTile();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    async function searchForMinAndMax() {
      console.log("minPriceP", minPriceP);
      console.log("maxPriceP", maxPriceP);
      //api
      searchForMinAndMax();
    }

    if (minPriceP && maxPriceP) {
      searchForMinAndMax();
    }
    // eslint-disable-next-line
  }, []);

  const handleSearchProduct = (e) => {
    console.log(e);
  };

  return (
    <>
      <div className="container">
        <form
          onSubmit={handleSubmit(handleSearchProduct)}
          className="my-4 d-flex flex-wrap flex-row justify-content-between align-items-center"
        >
          <div className="col-12 col-md-4 d-flex justtify-content-center align-items-center">
            <div className="w-100 input-group mb-3 d-flex justify-content-center algin-items-center">
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
          <div className="col-12 col-md-4 d-flex justtify-content-center align-items-center">
            <div className="w-100 d-flex flex-column justify-content-center algin-items-center">
              <div className="col-12 d-flex flex-row flex-wrap justify-content-evenly align-items-center">
                <div className="col-6">
                  <select
                    id="fromWarehouse"
                    type="number"
                    className="form-select form-select-lg mb-3"
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
