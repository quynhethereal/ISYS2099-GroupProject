import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

const CategorySubMenu = ({ data, handleChoose }) => {
  return (
    <ul className="dropdown-menu dropdown-submenu">
      <li>
        <Dropdown.Item onClick={() => handleChoose(data)}>
          {data?.name}
        </Dropdown.Item>
        {data?.subcategories?.map((child) => {
          return (
            <CategorySubMenu
              data={child}
              handleChoose={handleChoose}
              key={child?.id}
            />
          );
        })}
      </li>
    </ul>
  );
};

export default CategorySubMenu;
