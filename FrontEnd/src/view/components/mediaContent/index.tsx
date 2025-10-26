export default function MediaContent({ urlImage }: { urlImage?: string }) {
  return (
    <div className="max-h-72 min-h-62 max-w-56 min-w-52">
      <img className="h-full w-full object-contain" src={urlImage} alt="" />
    </div>
  );
}
