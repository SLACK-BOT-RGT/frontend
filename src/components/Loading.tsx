import { OrbitProgress } from "react-loading-indicators";

const Loading = () => {
  return (
    <div className="flex w-screen h-screen bg-custom-secondary justify-center items-center">
      <OrbitProgress
        variant="track-disc"
        color="#26244f"
        size="medium"
        text=""
        textColor=""
      />
    </div>
  );
};

export default Loading;
