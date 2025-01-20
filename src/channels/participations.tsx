import React from "react";

const ResponseList = ({ data }) => (
  <div>
    <h2>Messages</h2>
    {data ? (
      <ul>
        {data.messages.map((response:any) => (
          <li key={response.id}>
            <strong>{response.user}:</strong> {response.text}
          </li>
        ))}
      </ul>
    ) : (
      <p>Loading...</p>
    )}
  </div>
);

export default ResponseList;
