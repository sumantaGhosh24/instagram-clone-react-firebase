interface ImageProps {
  src: string;
  caption: string;
}

export default function Image({src, caption}: ImageProps) {
  return (
    <img src={src} alt={caption} className="h-[300px] w-full object-cover" />
  );
}
