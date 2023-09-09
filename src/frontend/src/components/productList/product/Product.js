import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { deleteProduct } from "../../../action/product/product";
import { getProductAllAttribute } from "../../../action/category/category";
import { useAuth } from "../../../hook/AuthHook.js";
import Swal from "sweetalert2";

import ProductPreview from "../../../utils/ProductPreview.js";
import ProductUpdateForm from "../../../utils/ProductUpdateForm.js";

const Product = ({ info, update }) => {
  const [showUpdateQuantityForm, setShowUpdateQuantityForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [attribute, setAttribute] = useState([]);
  const navigate = useNavigate();
  const { token } = useAuth();
  const hanleViewProduct = (item) => {
    navigate(`/customer/product/details/${item.id}`);
  };
  const handleUpdateProductQuantity = (item) => {
    handleOpenUpdateQuantityForm();
  };

  const handleOpenUpdateQuantityForm = () => {
    setShowUpdateQuantityForm((prev) => !prev);
  };

  const handleOpenUpdateForm = () => {
    setShowUpdateForm((prev) => !prev);
  };

  const handleUpdateProduct = (item) => {
    handleOpenUpdateForm();
  };

  const handleDeleteProduct = () => {
    Swal.fire({
      title: "Do you want to delete this product? This can't be reverted",
      showDenyButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteProduct(token(), info?.id).then((res) => {
          if (res?.message) {
            Swal.fire({
              icon: "success",
              title: res?.message,
              text: "Reloading in 2 secs for changes...",
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {
              navigate(0);
            });
          } else {
            Swal.fire({
              title: "Could not delete the product",
              icon: "error",
            });
          }
        });
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  useEffect(() => {
    async function getAllAtr() {
      await getProductAllAttribute(info?.id).then((res) => {
        if (!res?.message) {
          setAttribute(res);
        }
      });
    }

    getAllAtr();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="card h-100" style={{ width: "16rem" }}>
        <div className="card-img-top text-center">
          <img
            src={info?.image}
            alt={info?.image_name ? info?.image_name : "product"}
            style={{ width: "100%", height: 200 }}
          />
        </div>
        <div className="card-body">
          <h5 className="card-title text-truncate">{info?.title}</h5>
          <div className="card-text">
            <p
              className="fw-bolder overflow-hidden"
              style={{ height: "4.5rem" }}
            >
              {info?.description}
            </p>
            <p className="text-truncate text-danger">
              <b className="text-decoration-underline fw-bold">đ</b>
              {info?.price}
            </p>
            <div className="overflow-y-scroll" style={{ height: 70 }}>
              <div className="d-flex flex-row flex-wrap mb-3 gap-1">
                {attribute?.map((item, index) => {
                  return (
                    <div key={index}>
                      {item?.value?.description !== "" && (
                        <span className="badge bg-info d-flex align-items-center justify-content-center text-truncate">
                          {update && item?.name} {item?.value?.description}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {update && showUpdateQuantityForm && (
            <ProductPreview
              data={info}
              show={showUpdateQuantityForm}
              handleClose={handleOpenUpdateQuantityForm}
              update={true}
            />
          )}
          {update && showUpdateForm && (
            <ProductUpdateForm
              data={info}
              show={showUpdateForm}
              handleClose={handleOpenUpdateForm}
            />
          )}
          {update ? (
            <div>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => handleUpdateProductQuantity(info)}
              >
                Update quantity
              </button>
              <button
                type="button"
                className="btn btn-warning mt-3"
                onClick={() => handleUpdateProduct(info)}
              >
                Update Product
              </button>
              <button
                type="button"
                className="btn btn-danger mt-3"
                onClick={() => handleDeleteProduct(info)}
              >
                Remove Product
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-success"
              onClick={() => hanleViewProduct(info)}
            >
              View product
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;
