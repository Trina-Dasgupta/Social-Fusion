import ChatWindow from "@/components/ChatWindow";


export default function Chat({ params }: { params: { friendId: string } }) {
  const { friendId } = params;

  return (
    <div className="container mt-4">
      <ChatWindow friendId={friendId} />
    </div>
  );
}