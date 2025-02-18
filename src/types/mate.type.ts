import { UserType } from "./auth.type";
import { Tables } from "./supabase";
export type MatePostType = Tables<"matePosts">;
export type matepostpetsType = Tables<"matepostpets">;

export type UserTypeForUsers = {
  id: string;
  age: string | null;
  mbti: string | null;
  email: string | null;
  gender: string | null;
  nickname: string;
  created_at: string;
  profile_img: string | null;
  introduction: string | null;
};

export type MatePostFullType = MatePostType & {
  position: {
    center: {
      lat: number;
      lng: number;
    };
    errMsg: string | null;
    isLoading: boolean;
  };
  users: UserType;
};

export type MatePostAllTypeForItem = MatePostType & {
  position: {
    center: {
      lat: number;
      lng: number;
    };
    errMsg: string | null;
    isLoading: boolean;
  };
  users: UserType[];
  matepostpets: matepostpetsType[];
  distance: number;
};

export type MatePostAllType = MatePostType & {
  position: {
    center: {
      lat: number;
      lng: number;
    };
    errMsg: string | null;
    isLoading: boolean;
  };
  users: UserType;
  matepostpets: matepostpetsType[];
};

export type MateNextPostType = Omit<MatePostFullType, "id" | "created_at" | "users">;

export type MatePostPetType = {
  post_id?: number; // post_id를 추가
  male_female: string;
  neutered: boolean | null;
  weight: string;
  characteristics: string;
};

export type Pets = {
  male_female: string;
  neutered: null | boolean;
  weight: number | null;
  characteristics: string;
  age: string;
};

export type PostsResponse = {
  data: MatePostAllTypeForItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
