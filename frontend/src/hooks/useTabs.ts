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

export const useTabs = (categoryId: string, category: CategoryResponse | null) => {
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
    try {
      setTabsLoading(true);
      const tabsData = await tabService.getTabs(parseInt(categoryId));
      setTabs(tabsData);
      setActiveTab("intro");
    } catch (error) {
      console.error("탭 로딩 실패:", error);
      setTabs([]);
      setActiveTab("intro");
    } finally {
      setTabsLoading(false);
    }
  }, [categoryId]);

  const handleAddTab = async () => {
    if (!newTabName.trim()) return;

    try {
      setIsAddingTab(true);
      await tabService.createTab(
        { tabName: newTabName.trim() },
        parseInt(categoryId)
      );
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
    const existingPost = tabPosts[parseInt(tabId)];
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
      const existingPost = tabPosts[tabId];

      if (existingPost) {
        await updatePost(postData, tabId);
      } else {
        await createPost(postData, parseInt(categoryId), tabId);
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
  };
};
