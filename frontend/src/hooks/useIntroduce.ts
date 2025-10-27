import { useState, useEffect } from "react";
import {
  getIntroduce,
  createIntroduce,
  updateIntroduce,
} from "@/features/post/service/postService";
import { IntroduceResponse } from "@/features/main/type/introduce";
import { CategoryResponse } from "@/features/category/types/category";

export const useIntroduce = (category: CategoryResponse | null) => {
  const [introduce, setIntroduce] = useState<IntroduceResponse | null>(null);
  const [introduceExists, setIntroduceExists] = useState(false);
  const [introLoading, setIntroLoading] = useState(true);

  useEffect(() => {
    const loadIntroduce = async () => {
      if (!category) return;

      try {
        setIntroLoading(true);
        const introduceData = await getIntroduce(category.id);

        if (introduceData && introduceData.title && introduceData.content) {
          setIntroduce({
            title: introduceData.title,
            content: introduceData.content,
          });
          setIntroduceExists(true);
        } else {
          setIntroduce({
            title: category.categoryTitle || `카테고리 ${category.publicId}`,
            content: "빈 게시글",
          });
          setIntroduceExists(false);
        }
      } catch (error) {
        console.error("introduce 데이터 조회 실패:", error);
        setIntroduce({
          title: category.categoryTitle || `카테고리 ${category.publicId}`,
          content: "빈 게시글",
        });
        setIntroduceExists(false);
      } finally {
        setIntroLoading(false);
      }
    };

    if (category) {
      loadIntroduce();
    }
  }, [category]);

  const saveIntroduce = async (title: string, content: string) => {
    if (!category) return;

    try {
      // 내용이 비어있으면 저장하지 않음
      if (!content.trim()) {
        return;
      }

      if (introduceExists) {
        await updateIntroduce({ title, content }, category.id);
      } else {
        await createIntroduce({ title, content }, category.id);
        setIntroduceExists(true);
      }
    } catch (error) {
      console.error("저장 실패:", error);
      throw error;
    }
  };

  return {
    introduce,
    setIntroduce,
    introduceExists,
    introLoading,
    saveIntroduce,
  };
};
