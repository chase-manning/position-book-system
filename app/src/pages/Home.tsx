import type { FC } from "react";
import { usePositions } from "../app/use-positions";

const Home: FC = () => {
  const positions = usePositions();
  console.log(positions);
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the Position Book System</p>
    </div>
  );
};

export default Home;
