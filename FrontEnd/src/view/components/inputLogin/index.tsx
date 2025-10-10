import React from "react";
import type { loginProps } from "../../../app/interfaces/login";
import { Password } from 'primereact/password';

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
  let properties: string | undefined = "";
  let typeInput = "text";

  if (type === "confirmPassword") {
    properties = data.confirmPassword;
    typeInput = "password";
  } else if (type === "email") {
    properties = data.email;
    typeInput = "email";
  } else if (type === "password") {
    properties = data.password;
    typeInput = "password";
  } else {
    properties = data.username;
  }

  return (
    <div className="h-[3.5rem] w-[22rem]">
      {typeInput === "password" ? (
        <Password
          value={properties}
          onChange={(e) => setData({ ...data, [type]: e.target.value })}
          placeholder={textDefault}
          toggleMask
          feedback={false}
          pt={{
            root: { className: '!h-full ' },
            
            input: {
              className: '!h-full !w-[22rem] !rounded-[3.25rem] !bg-[#F6F6F6] !px-4 !border-none',
            },
          }}
        />
      ) : (
        <input
          type={typeInput}
          value={properties}
          onChange={(e) => setData({ ...data, [type]: e.target.value })}
          placeholder={textDefault}
          className="h-full w-full rounded-[3.25rem] bg-[#F6F6F6] px-4"
        />
      )}
    </div>
  );
}