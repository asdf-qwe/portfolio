import { useState, useEffect } from "react";
import {
  getIntroduce,
  createIntroduce,
  updateIntroduce,
} from "@/features/post/service/postService";
import { IntroduceResponse } from "@/features/main/type/introduce";

export const useIntroduce = (
  categoryId: string,
  categoryTitle: string | undefined
) => {
  const [introduce, setIntroduce] = useState<IntroduceResponse | null>(null);
  const [introduceExists, setIntroduceExists] = useState(false);
  const [introLoading, setIntroLoading] = useState(true);

  useEffect(() => {
    const loadIntroduce = async () => {
      try {
        setIntroLoading(true);
        const introduceData = await getIntroduce(parseInt(categoryId));

        if (introduceData && introduceData.title && introduceData.content) {
          setIntroduce({
            title: introduceData.title,
            content: introduceData.content,
          });
          setIntroduceExists(true);
        } else {
          setIntroduce({
            title: categoryTitle || `카테고리 ${categoryId}`,
            content: "빈 게시글",
          });
          setIntroduceExists(false);
        }
      } catch (error) {
        console.error("introduce 데이터 조회 실패:", error);
        setIntroduce({
          title: categoryTitle || `카테고리 ${categoryId}`,
          content: "빈 게시글",
        });
        setIntroduceExists(false);
      } finally {
        setIntroLoading(false);
      }
    };

    if (categoryId) {
      loadIntroduce();
    }
  }, [categoryId, categoryTitle]);

  const saveIntroduce = async (title: string, content: string) => {
    try {
      if (introduceExists) {
        await updateIntroduce({ title, content }, parseInt(categoryId));
      } else {
        await createIntroduce({ title, content }, parseInt(categoryId));
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
