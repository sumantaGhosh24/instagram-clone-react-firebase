interface FooterProps {
  caption: string;
  username: string;
}

export default function Footer({caption, username}: FooterProps) {
  return (
    <div className="p-4 pt-2 pb-1">
      <span className="mr-1 font-bold">{username}</span>
      <span className="italic">{caption}</span>
    </div>
  );
}
