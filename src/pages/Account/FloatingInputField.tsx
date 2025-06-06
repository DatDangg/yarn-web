import { LockOutlined } from "@ant-design/icons";
import { Field, ErrorMessage } from "formik";

interface Props {
  value: string;
  label: string;
  type?: string;
  disabled?: boolean;
}

export default function FloatingInputField({ value, label, type = "text", disabled = false }: Props) {
  return (
    <div className="relative w-full">
      <Field
        name={value}
        type={type}
        disabled={disabled}
        placeholder=" "
        className="peer w-full border border-black rounded px-3 py-3 text-[18px] placeholder-transparent focus:outline-none focus:border-[var(--active-color)]"
      />
      <label
        htmlFor={value}
        className="absolute left-3 top-[-13px] text-[16px] font-[600] font-[family-name:var(--font-Gentium)] text-[var(--text-color)] transition-all duration-200
          peer-placeholder-shown:top-[29%] peer-placeholder-shown:text-base peer-placeholder-shown:text-[var(--text-color)] font-[600] font-[family-name:var(--font-Gentium)]
          peer-focus:top-[-13px] peer-focus:text-[16px] font-[600] font-[family-name:var(--font-Gentium)] peer-focus:text-[var(--active-color)] bg-white px-1 pointer-events-none"
      >
        {label}
      </label >
      {disabled && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <LockOutlined />
          </span>
        )}
      <ErrorMessage name={value} component="div" className="text-red-500 text-xs mt-1" />
    </div>
  );
}
