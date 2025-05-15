import type { FC } from "react";
import { usePositions } from "../app/use-positions";

const Home: FC = () => {
  const { data: positions, isLoading, error } = usePositions();

  if (isLoading) {
    return <div>Loading positions...</div>;
  }

  if (error) {
    return <div>Error loading positions: {error.message}</div>;
  }

  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the Position Book System</p>
      <div>
        <h2>Positions</h2>
        {positions?.map((position) => (
          <div key={`${position.Account}-${position.Security}`}>
            <h3>Account: {position.Account}</h3>
            <p>Security: {position.Security}</p>
            <p>Quantity: {position.Quantity}</p>
            <h4>Events:</h4>
            <ul>
              {position.Events.map((event) => (
                <li key={event.ID}>
                  {event.Action} - Quantity: {event.Quantity}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
