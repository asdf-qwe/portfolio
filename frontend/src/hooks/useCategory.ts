import { useState, useEffect } from "react";
import { categoryService } from "@/features/category/service/categoryService";
import { CategoryResponse } from "@/features/category/types/category";

export const useCategory = (userId: string, categoryId: string) => {
  const [category, setCategory] = useState<CategoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError(null);

        const categories = await categoryService.getCategories(
          parseInt(userId)
        );
        const foundCategory = categories.find(
          (cat) => cat.id === parseInt(categoryId)
        );

        if (foundCategory) {
          setCategory(foundCategory);
        } else {
          setError("카테고리를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("카테고리 조회 실패:", error);
        setError("카테고리를 찾을 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId, userId]);

  return { category, loading, error, setCategory };
};
