import React from "react";
import type { loginProps } from "../../../app/interfaces/login";

export default function LoginForm({
  type,
  textDefault,
  setData,
  data,
}: {
  type: string;
  textDefault: string;
  setData: React.Dispatch<React.SetStateAction<loginProps>>;
  data: loginProps;
}) {
  const properties = {
    value: type === "email" ? data.email : data.password,
  };

  return (
    <div className="h-[3.5rem] w-[22rem]">
      <input
        type={type}
        value={properties.value}
        onChange={(e) => setData({ ...data, [type]: e.target.value })}
        placeholder={textDefault}
        className="h-full w-full rounded-[3.25rem] bg-[#F6F6F6] px-4"
      />
    </div>
  );
}
