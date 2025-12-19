interface Props {
  content: string;
  senderName: string;
  fontStyle: string;
  textAlign: string;
}

export default function CardRenderer({
  content,
  senderName,
  fontStyle,
  textAlign,
}: Props) {
  return (
    <div
      className="border rounded p-6 min-h-[300px]"
      style={{
        fontFamily: fontStyle,
        textAlign: textAlign as any,
      }}
    >
      <p className="mb-6 whitespace-pre-wrap">{content}</p>
      <p className="text-right font-medium">— {senderName}</p>
    </div>
  );
}
