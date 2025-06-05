export default function formatPrice(input: number) {
  return (
    <span className="flex items-start">
      <span className="text-[12px] pr-[1px] underline">đ</span>
      {input.toLocaleString()}
    </span>
  );
}
