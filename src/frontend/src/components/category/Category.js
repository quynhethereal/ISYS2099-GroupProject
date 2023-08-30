import React from "react";

import CategoryRow from "../../utils/CategoryRow.js";

const Category = () => {
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

  function returnRecusiveData(data) {
    var newData = data?.map((item) => {
      return findTheChildOfItem(item);
    });
    return newData;
  }

  function findTheChildOfItem(item) {
    var theChild = testData?.filter(
      (elements) => elements?.parent === item?.id
    );
    if (theChild.length > 0) {
      return { ...item, child: findTheChildOfItem(theChild[0]) };
    }
    return item;
  }

  return (
    <div className="container m-4">
      {returnRecusiveData(testData)?.map((category, index) => {
        return (
          <div key={index}>
            {!category?.parent && <CategoryRow data={category} />}
          </div>
        );
      })}
    </div>
  );
};

export default Category;
