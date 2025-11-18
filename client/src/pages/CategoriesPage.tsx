import React from "react";
import Categories from "../components/Categories.tsx";
import Title from "../components/Title.tsx";

export const CategoriesPage: React.FC = () => {
  return (
    <>
      <Title>Categories</Title>
      <Categories/>
    </>
  )
}