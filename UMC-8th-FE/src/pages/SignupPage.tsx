import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSignup } from "../apis/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const schema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(8, {
        message: "비밀번호는 8자 이상이어야 합니다.",
      })
      .max(20, {
        message: "비밀번호는 20자 이하여야 합니다.",
      }),

    passwordCheck: z
      .string()
      .min(8, {
        message: "비밀번호는 8자 이상이어야 합니다.",
      })
      .max(20, {
        message: "비밀번호는 20자 이하여야 합니다.",
      }),
    name: z.string().min(1, { message: "이름을 입력해 주세요." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordCheck: string, ...rest } = data;

    const response = await postSignup(rest);

    console.log(response);
  };

  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      {page === 1 && (
        <div className="flex flex-col gap-3">
          <button
            className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
      hover:bg-[#b2dab1] transition-all duration-200 disabled:bg-gray-300
      cursor-pointer disabled:cursor-not-allowed"
            onClick={() => navigate(`/`)}
          >
            {`<`} 홈으로 가기
          </button>
          <input
            {...register("email")}
            className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
        ${errors?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
            type={"email"}
            placeholder={"이메일"}
          />
          {errors.email && (
            <div className="text-red-500 text-sm">{errors.email.message}</div>
          )}

          <button
            onClick={async () => {
              const isValid = await trigger("email");
              if (isValid) {
                setPage(2);
              }
            }}
            disabled={isSubmitting}
            type="button"
            className="w-full bg-blue-600 text-white py-3 rounded-b-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
          >
            다음
          </button>
        </div>
      )}

      {page === 2 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <button
              className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
            hover:bg-[#b2dab1] transition-all duration-200 disabled:bg-gray-300
            cursor-pointer disabled:cursor-not-allowed"
              onClick={() => setPage(page - 1)}
            >
              {`<`}
            </button>
            <span className="text-black text-xl w-full text-center px-6 py-3 rounded-lg font-extrabold">
              회원가입
            </span>
          </div>
          <span className="text-black text-sm px-6 py-3 rounded-lg shadow-md">
            ✉️ {watch("email")}
          </span>
          <input
            {...register("password")}
            className={`items-center border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
            ${
              errors?.password ? "border-red-500 bg-red-200" : "border-gray-300"
            }`}
            type={showPassword ? "text" : "password"}
            placeholder={"비밀번호"}
          />
          <button
            type="button"
            className="text-xs items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁"}
          </button>

          {errors.password && (
            <div className="text-red-500 text-sm">
              {errors.password.message}
            </div>
          )}

          <input
            {...register("passwordCheck")}
            className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
            ${
              errors?.passwordCheck
                ? "border-red-500 bg-red-200"
                : "border-gray-300"
            }`}
            type={showPasswordCheck ? "text" : "password"}
            placeholder={"비밀번호 확인"}
          />
          <button
            type="button"
            onClick={() => setShowPasswordCheck(!showPasswordCheck)}
          >
            {showPasswordCheck ? "🙈" : "👁"}
          </button>
          {errors.passwordCheck && (
            <div className="text-red-500 text-sm">
              {errors.passwordCheck.message}
            </div>
          )}

          <button
            onClick={async () => {
              const isValid = await trigger(["password", "passwordCheck"]);
              if (isValid) {
                setPage(3);
              }
            }}
            disabled={isSubmitting}
            type="button"
            className="w-full bg-blue-600 text-white py-3 rounded-b-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
          >
            다음
          </button>
        </div>
      )}

      {page === 3 && (
        <div className="flex flex-col gap-3">
          <button
            className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
      hover:bg-[#b2dab1] transition-all duration-200 disabled:bg-gray-300
      cursor-pointer disabled:cursor-not-allowed"
            onClick={() => setPage(page - 1)}
          >
            {`<`}
          </button>
          <input
            {...register("name")}
            className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
        ${errors?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
            type={"name"}
            placeholder={"이름"}
          />
          {errors.name && (
            <div className="text-red-500 text-sm">{errors.name.message}</div>
          )}

          <button
            disabled={isSubmitting}
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="w-full bg-blue-600 text-white py-3 rounded-b-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
          >
            회원가입 완료
          </button>
        </div>
      )}
    </div>
  );
};

export default SignupPage;
