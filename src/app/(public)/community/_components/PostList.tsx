"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { PostsResponse } from "@/types/TypeOfCommunity/CommunityTypes";

interface PostListProps {
  selectedCategory: string;
  searchTerm: string;
  selectedSort: string;
}

const fetchPosts = async (page: number, category: string, searchTerm: string, sort: string): Promise<PostsResponse> => {
  const url =
    sort === "댓글많은순"
      ? `/api/sortByComments?page=${page}&limit=3&category=${category}&search=${searchTerm}`
      : `/api/community?page=${page}&limit=3&category=${category}&search=${searchTerm}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("메인페이지오류");
  }
  return response.json();
};

const PostList: React.FC<PostListProps> = ({ selectedCategory, searchTerm, selectedSort }) => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useQuery<PostsResponse, Error>({
    queryKey: ["posts", page, selectedCategory, searchTerm, selectedSort],
    queryFn: () => fetchPosts(page, selectedCategory, searchTerm, selectedSort)
  });

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, searchTerm, selectedSort]);

  const sortPosts = (posts: any[]) => {
    if (selectedSort === "최신순") {
      return [...posts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (selectedSort === "댓글많은순") {
      return [...posts].sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
    }
    return posts;
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-t-4 border-solid border-mainColor"></div>
          <p className="text-lg font-semibold text-mainColor">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center bg-red-100">
        <div className="max-w-xs rounded-lg bg-white p-4 text-center shadow-md">
          <h2 className="font-bold text-red-600">에러 발생</h2>
          <p className="text-sm text-red-600">{error.message}</p>
          <svg className="mx-auto my-2 h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <button
            className="rounded bg-red-600 px-2 py-1 text-sm text-white hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  const sortedPosts = sortPosts([...(data?.data || [])]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="mb-5 text-2xl font-bold">게시글 목록</h1>

      <div className="space-y-6">
        {sortedPosts.map((post) => (
          <Link key={post.id} href={`/community/${post.id}`}>
            <div className="mb-6 flex h-[220px] overflow-hidden rounded-lg border border-mainColor p-3 shadow-sm">
              <div className="flex flex-grow flex-col justify-between p-4">
                <div>
                  <div className="mb-4 rounded-md bg-[#f7faff] p-1">
                    <h2 className="text-lg font-semibold">{post.title}</h2>
                  </div>
                  <div className="mb-2 rounded-md bg-[#f7faff] p-4">
                    <p className="mb-2 line-clamp-3 text-sm text-gray-600">{post.content}</p>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <p className="text-xs text-gray-500">
                    {post.users?.nickname} | {new Date(post.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">댓글 {post.comments.length}개</p>
                </div>
              </div>
              <div className="flex">
                {post.post_imageURL && post.post_imageURL.length && post.post_imageURL[0] && (
                  <div className="my-auto ml-6 mr-3 h-[140px] w-[140px] flex-shrink-0 rounded-md border border-[#e6efff]">
                    <img
                      src={post.post_imageURL[0]}
                      alt={`게시글 이미지 `}
                      className="h-full w-full rounded-md object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex justify-center space-x-2">
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
          className="rounded bg-mainColor px-4 py-2 text-white disabled:bg-mainColor"
        >
          이전
        </button>

        <span className="px-4 py-2">
          페이지 {page} / {data?.totalPages}
        </span>

        <button
          onClick={() => setPage((old) => (data?.totalPages && old < data.totalPages ? old + 1 : old))}
          disabled={data?.totalPages !== undefined && page === data.totalPages}
          className="rounded bg-mainColor px-4 py-2 text-white disabled:bg-mainColor"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default PostList;
