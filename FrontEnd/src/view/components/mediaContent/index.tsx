export default function MediaContent({ urlImage }: { urlImage?: string }) {
  return (
    <div className="min-h-62 min-w-48">
      <img className="h-full w-full" src={urlImage} alt="" />
    </div>
  );
}
