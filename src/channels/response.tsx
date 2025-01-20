
const MessageList = ({ data }) => (
  <div>
    <h2>Messages</h2>
    {data ? (
      <ul>
        {data.messages.map((message:any) => (
          <li key={message.id}>
            <strong>{message.user}:</strong> {message.text}
          </li>
        ))}
      </ul>
    ) : (
      <p>Loading...</p>
    )}
  </div>
);

export default MessageList;
