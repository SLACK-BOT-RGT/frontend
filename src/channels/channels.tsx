import * as React from "react"
const ChannelList = ({data}) => (
  <div>
    <h2>Channels</h2>
    {data ? (
      <ul>
        {data.channels.map((channel : any) => (
          <li key={channel.id}>{channel.name}</li>
        ))}
      </ul>
    ) : (
      <p>Loading...</p>
    )}
  </div>
);

export default ChannelList;
