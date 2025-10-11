export default function ContentInfos({
  info,
  bool,
}: {
  info: string;
  bool?: boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <span>{info}</span>
      {bool && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="5"
          height="6"
          viewBox="0 0 5 6"
          fill="none"
        >
          <circle cx="2.5" cy="3" r="2.5" fill="white" fill-opacity="0.6" />
        </svg>
      )}
    </div>
  );
}
