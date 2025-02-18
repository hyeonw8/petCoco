"use client";
import { v4 as uuidv4 } from "uuid";
import { ChangeEvent, MouseEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { UsersPetType } from "@/types/auth.type";
import { Input, Textarea } from "@nextui-org/input";
import { defaultPetImg } from "@/components/DefaultImg";

type PetType = UsersPetType;

const AddMypetProfile = () => {
  const [petName, setPetNickName] = useState("");
  const [age, setAge] = useState("");
  const [majorClass, setMajorClass] = useState("");
  const [minorClass, setMinorClass] = useState("");
  const [maleFemale, setMaleFemale] = useState("");
  const [neutralized, setNeutralized] = useState("");
  const [weight, setWeight] = useState(0);
  const [medicalRecords, setMedicalRecords] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [petImage, setPetImage] = useState<File | null>(); //서버에 반영될 이미지 파일
  const [previewImage, setPreviewImage] = useState(""); // 이미지 변경 확인을 위해 보여줄 임시 url
  const params = useParams();
  const supabase = createClient();
  const router = useRouter();
  const updateProfileWithSupabase = async ({
    petName,
    petImage,
    age,
    male_female,
    neutralized,
    majorClass,
    minorClass,
    weight,
    medicalRecords,
    introduction
  }: Pick<
    PetType,
    | "petName"
    | "petImage"
    | "age"
    | "male_female"
    | "majorClass"
    | "minorClass"
    | "weight"
    | "medicalRecords"
    | "neutralized"
    | "introduction"
  >) => {
    const response = await fetch(`/api/mypage/${id}/mypetprofile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        petName,
        petImage,
        age,
        neutralized,
        male_female,
        majorClass,
        minorClass,
        weight,
        medicalRecords,
        introduction
      })
    });
    return response.json();
  };

  const updateMutate = useMutation({
    mutationFn: updateProfileWithSupabase
  });

  if (params === null) {
    return;
  }
  const id = params.id;

  const toMyPet = () => {
    router.push(`/mypage/${id}/myprofile`);
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    let image = window.URL.createObjectURL(file);
    setPreviewImage(image);
    setPetImage(file);
  };

  const handlePetNameChange = (e: ChangeEvent<HTMLInputElement>) => setPetNickName(e.target.value);

  const handleMajorClassChange = (e: ChangeEvent<HTMLInputElement>) => setMajorClass(e.target.value);
  const handleMinorClassChange = (e: ChangeEvent<HTMLInputElement>) => setMinorClass(e.target.value);

  const handleMaleFemaleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMaleFemale(e.currentTarget.value);
  };

  const handleNeutralize = (e: ChangeEvent<HTMLInputElement>) => {
    setNeutralized(e.currentTarget.value);
  };

  const handleAgeChange = (e: ChangeEvent<HTMLInputElement>) => setAge(e.target.value);
  const handleWeight = (e: ChangeEvent<HTMLInputElement>) => setWeight(Number(e.target.value));
  const handleMedicalRecords = (e: ChangeEvent<HTMLInputElement>) => setMedicalRecords(e.target.value);
  const handleIntroductionChange = (e: ChangeEvent<HTMLInputElement>) => setIntroduction(e.target.value);

  const submitChange = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const imageId = uuidv4();
    const FILE_NAME = "profile_image";
    const fileUrl = `${FILE_NAME}_${imageId}`;

    let petImageUrl = "";
    if (petImage) {
      const imgData = await supabase.storage.from("pet_image").upload(fileUrl, petImage);
      const imgUrl = supabase.storage.from("pet_image").getPublicUrl(imgData.data!.path);
      petImageUrl = imgUrl.data.publicUrl;
    }

    updateMutate.mutate({
      petName: petName,
      petImage: petImageUrl,
      age: age,
      majorClass: majorClass,
      minorClass: minorClass,
      male_female: maleFemale,
      neutralized: neutralized,
      weight: weight,
      medicalRecords: medicalRecords,
      introduction: introduction
    });

    alert("프로필 등록이 성공적으로 완료되었습니다!");

    toMyPet();
  };

  return (
    <div
      className="my-auto flex flex-col items-center justify-center rounded-[30px] bg-white"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="mt-5 text-2xl font-bold">애완동물 추가하기</p>
      <div className="my-auto mt-5 flex max-h-[400px] max-w-[300px] flex-col items-center justify-center">
        <img
          className="max-h-[200px] max-w-[200px] object-cover"
          src={previewImage || defaultPetImg}
          alt="profile_img"
        />
        <br></br>
        <button
          className="rounded border border-[#C9C9C9] bg-mainColor px-4 py-2 text-center text-[16px] font-semibold text-black"
          type={"button"}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          이미지 추가하기
        </button>
        <input id="fileInput" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
      </div>
      <br />
      <div className="w-[600px]">
        <p className="font-bold">이름(최대 8자)</p>
        <Input
          className="mt-2"
          type="text"
          placeholder="애완동물의 이름(최대 8자)"
          maxLength={8}
          defaultValue={petName}
          onChange={handlePetNameChange}
        />
        <br />
        <p className="font-bold">대분류</p>
        <Input
          className="mt-2"
          type="text"
          placeholder="개, 고양이, 물고기 등등"
          maxLength={100}
          defaultValue={majorClass}
          onChange={handleMajorClassChange}
        />
        <br />
        <p className="font-bold">소분류</p>
        <Input
          className="mt-2"
          type="text"
          placeholder="치와와, 랙돌, 금붕어 등등"
          maxLength={100}
          defaultValue={minorClass}
          onChange={handleMinorClassChange}
        />
        <br />
        <p className="font-bold">나이</p>
        <Input
          className="mt-2"
          type="text"
          placeholder="나이"
          maxLength={100}
          defaultValue={age}
          onChange={handleAgeChange}
        />
        <br />
        <p className="font-bold">성별</p>
        <div className="mt-2 flex gap-[10px] pl-2">
          <input type="checkbox" name="gender" value="암" onChange={handleMaleFemaleChange} /> 암&nbsp;
          <input type="checkbox" name="gender" value="수" onChange={handleMaleFemaleChange} /> 수
        </div>
        <br />
        <p className="font-bold">중성화 여부</p>
        <div className="mt-2 flex gap-[10px] pl-2">
          <input type="checkbox" name="neutralize" value="YES" onChange={handleNeutralize} /> YES &nbsp;
          <input type="checkbox" name="neutralize" value="No" onChange={handleNeutralize} /> No
        </div>
        <br />
        <p className="font-bold">무게(kg)</p>
        <input
          type="number"
          step="0.1"
          placeholder="1kg 미만은 소수점으로 표기"
          maxLength={100}
          className="mt-2 h-[40px] rounded-md bg-gray-100 px-2"
          name="weight"
          onChange={handleWeight}
        />
        <br />
        <p className="mt-6 font-bold">의료기록(최대 200자)</p>
        <Textarea
          className="mt-2"
          placeholder="예방접종 및 기타 의료 기록(최대 200자)"
          maxLength={200}
          defaultValue={medicalRecords}
          onChange={handleMedicalRecords}
        />
        <br />
        <p className="mt-2 font-bold">특징(최대 200자)</p>
        <Textarea
          className="mt-2"
          placeholder="좋아하는 것, 싫어하는 것 등등(최대 200자)"
          maxLength={200}
          defaultValue={introduction}
          onChange={handleIntroductionChange}
        />
      </div>
      <div className="mb-20 mt-5 flex gap-[15px]">
        <button
          className="rounded border border-[#C9C9C9] bg-mainColor px-4 py-2 text-center text-[16px] font-semibold text-black"
          onClick={toMyPet}
        >
          뒤로가기
        </button>
        <button
          className="rounded border border-[#C9C9C9] bg-mainColor px-4 py-2 text-center text-[16px] font-semibold text-black"
          onClick={submitChange}
        >
          등록하기
        </button>
      </div>
    </div>
  );
};

export default AddMypetProfile;
