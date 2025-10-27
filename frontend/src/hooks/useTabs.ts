import { useState, useEffect, useCallback } from "react";
import { tabService } from "@/features/tab/service/tabService";
import { TabRes } from "@/features/tab/types/tab";
import { CategoryResponse } from "@/features/category/types/category";
import {
  getPostByTab,
  updatePost,
  createPost,
} from "@/features/post/service/postService";
import { PostResponse } from "@/features/post/types/post";

export const useTabs = (
  categoryId: string,
  category: CategoryResponse | null
) => {
  const [tabs, setTabs] = useState<TabRes[]>([]);
  const [tabsLoading, setTabsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [newTabName, setNewTabName] = useState("");
  const [isAddingTab, setIsAddingTab] = useState(false);

  const [tabPosts, setTabPosts] = useState<{
    [tabId: string]: PostResponse | null;
  }>({});
  const [editingTab, setEditingTab] = useState<string | null>(null);
  const [postContent, setPostContent] = useState("");
  const [isSavingPost, setIsSavingPost] = useState(false);

  const fetchTabs = useCallback(async () => {
    if (!category) return;

    try {
      setTabsLoading(true);
      const tabsData = await tabService.getTabs(category.id);
      setTabs(tabsData);
      setActiveTab("intro");
    } catch (error) {
      console.error("탭 로딩 실패:", error);
      setTabs([]);
      setActiveTab("intro");
    } finally {
      setTabsLoading(false);
    }
  }, [category]);

  const handleAddTab = async () => {
    if (!newTabName.trim() || !category) return;

    try {
      setIsAddingTab(true);
      await tabService.createTab({ tabName: newTabName.trim() }, category.id);
      setNewTabName("");
      await fetchTabs();
    } catch (error) {
      console.error("탭 추가 실패:", error);
      throw error;
    } finally {
      setIsAddingTab(false);
    }
  };

  const fetchTabPost = async (tabId: number) => {
    try {
      const post = await getPostByTab(tabId);
      setTabPosts((prev) => ({
        ...prev,
        [tabId.toString()]: post,
      }));
    } catch (error) {
      console.error("탭 게시글 조회 실패:", error);
      setTabPosts((prev) => ({
        ...prev,
        [tabId.toString()]: null,
      }));
    }
  };

  const startEditingTabPost = async (tabId: string) => {
    const tabIdNum = parseInt(tabId);

    // 해당 탭의 게시글이 아직 로드되지 않았다면 먼저 로드
    if (!(tabIdNum in tabPosts)) {
      await fetchTabPost(tabIdNum);
    }

    const existingPost = tabPosts[tabIdNum];
    if (existingPost && existingPost.content && existingPost.content.trim()) {
      setPostContent(existingPost.content);
    } else {
      setPostContent("");
    }
    setEditingTab(tabId);
  };

  const saveTabPost = async () => {
    if (!editingTab) return;

    try {
      setIsSavingPost(true);
      const postData = { content: postContent, imageUrl: "" };
      const tabId = parseInt(editingTab);

      // 백엔드에서 직접 게시글 존재 여부 확인
      const existingPostFromServer = await getPostByTab(tabId);

      // 게시글이 존재하지 않으면 생성, 존재하면 수정
      if (!existingPostFromServer) {
        if (!category) throw new Error("카테고리 정보가 없습니다.");
        await createPost(postData, category.id, tabId);
      } else {
        await updatePost(postData, tabId);
      }

      await fetchTabPost(tabId);
      setEditingTab(null);
      setPostContent("");
    } catch (error) {
      console.error("게시글 저장 실패:", error);
      throw error;
    } finally {
      setIsSavingPost(false);
    }
  };

  const cancelEditingTabPost = () => {
    setEditingTab(null);
    setPostContent("");
  };

  const handleDeleteTab = async (tabId: number) => {
    if (!confirm("정말로 이 탭을 삭제하시겠습니까?")) return;

    try {
      await tabService.deleteTab(tabId);
      await fetchTabs();
      // 삭제된 탭이 현재 활성 탭이면 기본 탭으로 변경
      if (activeTab === tabId.toString()) {
        setActiveTab("intro");
      }
    } catch (error) {
      console.error("탭 삭제 실패:", error);
      alert("탭 삭제에 실패했습니다.");
    }
  };

  useEffect(() => {
    if (categoryId && category) {
      fetchTabs();
    }
  }, [categoryId, category, fetchTabs]);

  useEffect(() => {
    if (tabs.length > 0 && !activeTab) {
      setActiveTab(tabs[0].id.toString());
    }
  }, [tabs, activeTab]);

  useEffect(() => {
    if (activeTab && tabs.length > 0) {
      const currentTab = tabs.find((tab) => tab.id.toString() === activeTab);
      if (currentTab) {
        fetchTabPost(currentTab.id);
      }
    }
  }, [activeTab, tabs]);

  return {
    tabs,
    tabsLoading,
    activeTab,
    setActiveTab,
    newTabName,
    setNewTabName,
    isAddingTab,
    handleAddTab,
    tabPosts,
    editingTab,
    postContent,
    setPostContent,
    isSavingPost,
    startEditingTabPost,
    saveTabPost,
    cancelEditingTabPost,
    handleDeleteTab,
  };
};
