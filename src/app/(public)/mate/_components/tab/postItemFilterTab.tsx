"use client";

import FilterSelectChip from "../chip/filterSelectChip";
import FilterDateChip from "../chip/filterDateChip";
import FilterWeightChip from "../chip/filterWeightChip";
import { gender, age, male_female, regions } from "../../selectOptionArray";

interface PostItemFilterTabProps {
  updateFilter: (filterName: string, value: any) => void;
  filters: {
    gender: string | null;
    date_time: string | undefined;
    male_female: string | null;
    age: string | null;
    weight: string | null;
    regions: string | null;
  };
  onClick: () => void;
}

const PostItemFilterTab = ({ updateFilter, filters, onClick }: PostItemFilterTabProps) => {
  return (
    <div className="w-full">
      <div className="w-full">
        <p className="text-lg text-gray-500">메이트 상세 필터</p>
        <FilterSelectChip
          label="성별"
          array={gender}
          selected={filters.gender}
          onSelect={(items) => updateFilter("gender", items)}
        />
        <FilterSelectChip
          label="연령대"
          array={age}
          selected={filters.age}
          onSelect={(items) => updateFilter("age", items)}
        />
        <FilterDateChip
          label="산책일"
          selected={filters.date_time}
          onSelect={(items) => updateFilter("date_time", items)}
        />
        <FilterSelectChip
          label="지역별"
          array={regions}
          selected={filters.regions}
          onSelect={(items) => updateFilter("regions", items)}
        />
      </div>
      <div className="mt-5">
        <p className="text-lg text-gray-500">반려견 정보 필터</p>
        <FilterWeightChip
          label="반려견 몸무게"
          selected={filters.weight}
          onSelect={(items) => updateFilter("weight", items)}
        />
        <FilterSelectChip
          label="성별"
          array={male_female}
          selected={filters.male_female}
          onSelect={(items) => updateFilter("male_female", items)}
        />
      </div>
      <div className="mt-7 flex">
        <div
          className="flex mb-4 h-12 w-full cursor-pointer items-center rounded-lg border-2 border-mainColor p-2 justify-center"
          onClick={onClick}
        >
          초기화
        </div>
      </div>
    </div>
  );
};

export default PostItemFilterTab;
