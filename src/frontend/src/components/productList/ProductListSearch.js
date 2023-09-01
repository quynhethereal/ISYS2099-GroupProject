import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { searchBySearchKey } from "../../action/product/product.js";
import { useSearchParams, useNavigate } from "react-router-dom";

import Product from "./product/Product.js";

import searchIcon from "../../assets/image/searchIcon.png";

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchKeyP = searchParams?.get("searchKeyP");
  const sortedDirectionP1 = searchParams?.get("sortedDirectionP1");
  const sortedTermP1 = searchParams?.get("sortedTermP1");
  const sortedDirectionP2 = searchParams?.get("sortedDirectionP2");
  const sortedTermP2 = searchParams?.get("sortedTermP2");
  const { register, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      searchKey: searchKeyP ? searchKeyP : "",
      sortedDirection1: sortedDirectionP1 ? sortedDirectionP1 : "DESC",
      sortedTerm1: sortedTermP1 ? sortedTermP1 : "",
      sortedDirection2: sortedDirectionP2 ? sortedDirectionP2 : "DESC",
      sortedTerm2: sortedTermP2 ? sortedTermP2 : "",
    },
  });
  const [change, setChange] = useState({
    check1: getValues("sortedDirection1") === "DESC" ? false : true,
    check2: getValues("sortedDirection2") === "DESC" ? false : true,
  });
  const [searchKeyData, setSearchKeyData] = useState([]);
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

  useEffect(() => {
    async function searchForDesAndTile() {
      //api
      await searchBySearchKey(
        searchKeyP,
        sortedTermP1 ? sortedDirectionP1 : "",
        sortedTermP1 || "",
        sortedTermP2 ? sortedDirectionP2 : "",
        sortedTermP2 || ""
      ).then((res) => {
        if (res?.products) {
          setSearchKeyData(res?.products);
        }
      });
    }
    if (searchKeyP) {
      searchForDesAndTile();
    }
    // eslint-disable-next-line
  }, []);

  const handleSearchProduct = (e) => {
    setSearchParams(
      `?searchKeyP=${e.searchKey}&sortedDirectionP1=${e.sortedDirection1}&sortedTermP1=${e.sortedTerm1}&sortedDirectionP2=${e.sortedDirection2}&sortedTermP2=${e.sortedTerm2}`
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
          <div className="col-12 col-md-6 d-flex justtify-content-center align-items-center">
            <div className="col-12 input-group d-flex justify-content-center algin-items-center">
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
        </form>
        {searchKeyData?.length !== 0 && (
          <div className="fw-bold fs-3 fw-bold text-info my-4 d-flex flex-warp flex-row justify-content-center align-items-center">
            Finding {searchKeyData?.length} products :
          </div>
        )}
        <div className="my-4 d-flex flex-wrap flex-row justify-content-center align-items-center">
          {searchKeyData?.map((item, index) => {
            return (
              <div key={index} className="">
                <Product info={item}></Product>
              </div>
            );
          })}
          {searchKeyData?.length === 0 && (
            <div className="w-100 text-center fs-3 fw-bold">None was found</div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductList;
