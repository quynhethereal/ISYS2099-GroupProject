import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

const CategorySubMenu = ({ data, handleChoose }) => {
  return (
    <ul className="dropdown-menu dropdown-submenu">
      {data?.subcategories?.map((sub) => {
        return (
          <li key={sub?.id}>
            <Dropdown.Item onClick={() => handleChoose(sub)}>
              {sub?.name}
            </Dropdown.Item>
            {sub?.subcategories?.length !== 0 && (
              <CategorySubMenu data={sub} handleChoose={handleChoose} />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default CategorySubMenu;
