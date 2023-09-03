import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { getAllProduct } from "../../action/product/product.js";
import { getAllCategory } from "../../action/category/category.js";
import { useSearchParams, useNavigate } from "react-router-dom";

import Dropdown from "react-bootstrap/Dropdown";
import CategorySubMenu from "../../utils/CategorySubMenu.js";
import "./ProductList.css";

import Product from "./product/Product.js";
import searchIcon from "../../assets/image/searchIcon.png";

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
  const { register, handleSubmit, getValues } = useForm({
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
  const [categoryList, setCategoryList] = useState([]);

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
        if (data?.totalProductCount === product?.length) {
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

  //on working

  useEffect(() => {
    async function getAllCategoryData() {
      await getAllCategory().then((res) => {
        if (res) {
          setCategoryList(res);
        }
      });
    }

    getAllCategoryData();
  }, []);

  const handleSearchProduct = (e) => {
    navigate(`/customer/search?searchKeyP=${e.searchKey}`);
  };

  const handleFilterByPrice = () => {
    if (!getValues("maxPrice")) {
      setFocus(true);
    } else {
      navigate(
        `/customer/price?minPriceP=${getValues(
          "minPrice"
        )}&maxPriceP=${getValues("maxPrice")}`
      );
    }
  };

  const handleFilterByCategory = (category) => {
    if (category?.id) {
      navigate(`/customer/browse?categoryP=${category?.id}`);
    }
  };

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
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Category Selection
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {categoryList?.map((parent, index) => {
                    return (
                      <li key={index}>
                        <Dropdown.Item
                          onClick={() => handleFilterByCategory(parent)}
                        >
                          {parent?.name}
                        </Dropdown.Item>
                        {parent?.subcategories?.map((child) => {
                          return (
                            <CategorySubMenu
                              data={child}
                              handleChoose={handleFilterByCategory}
                              key={child?.id}
                            />
                          );
                        })}
                      </li>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>
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
