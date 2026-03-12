import Note from "../dashboard/Note";
import Shelf from "../dashboard/Shelf";
import Todo from "../dashboard/Todo";
import Calendar from "../dashboard/Calendar";

// Can setup conditional rendering for blocks or place them in different sections of the dashboard

export default function Dashboard() {
  return (
    <div className="p-3 h-full">
      <div className="grid grid-cols-3 gap-3 h-full">
        <Todo />
        <div className="h-full flex flex-col gap-3">
          <Note />
          <Shelf />
        </div>
        <Calendar />
      </div>
    </div>
  );
}

