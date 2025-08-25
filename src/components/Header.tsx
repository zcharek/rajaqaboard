// @ts-nocheck
import React from "react";

function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center">
          <img src={process.env.PUBLIC_URL + "/rajagroup.png"} alt="Raja Group" className="h-10 w-auto" />
        </div>
      </div>
    </header>
  );
}

export default Header;
