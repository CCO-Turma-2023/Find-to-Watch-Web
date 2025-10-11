export default function ContentType({ type }: { type: string }) {
  return (
    <div className="flex h-[2.3125rem] w-[5.75rem] flex-col items-center justify-center rounded-full bg-[#121212] p-2">
      <span className="font-bold text-[#FFFFFFCC]">{type}</span>
    </div>
  );
}
