import { Frown } from "lucide-react";

export const Unauthorized = () => {
  return (
    <div className="flex gap-3 items-center justify-center mt-[200px]">
        <Frown size={60} /><p>Sorry you dont have the right permissions to view this page</p>
    </div>
  );
};
