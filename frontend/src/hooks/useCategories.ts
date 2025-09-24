import { useState, useEffect } from "react";
import { categoryService } from "@/features/category/service/categoryService";
import { CategoryResponse } from "@/features/category/types/category";

export const useCategories = (userId: string) => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // 카테고리 데이터 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const categoriesData = await categoryService.getCategories(
          parseInt(userId)
        );
        setCategories(categoriesData);
      } catch (error) {
        console.error("카테고리 조회 실패:", error);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [userId]);

  // 카테고리 생성 함수
  const createCategory = async (categoryTitle: string) => {
    const newCategory = await categoryService.createCategory(
      { categoryTitle },
      parseInt(userId)
    );

    // 카테고리 목록 새로고침
    const categoriesData = await categoryService.getCategories(
      parseInt(userId)
    );
    setCategories(categoriesData);

    return newCategory;
  };

  return {
    categories,
    categoriesLoading,
    createCategory,
    setCategories,
  };
};
