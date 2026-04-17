import { useOutletContext } from "react-router-dom";
import Note from "../dashboard/Note";
import Shelf from "../dashboard/Shelf";
import Todo from "../dashboard/Todo";
import Calendar from "../dashboard/Calendar";
import TimerWidget from "../dashboard/TimerWidget";

export default function Dashboard() {
  const { visible } = useOutletContext();

  // Middle column shows if any of these are visible
  const showMiddle = visible.note || visible.shelf || visible.timer;

  const gridClass =
    visible.todo && showMiddle && visible.calendar ? "grid-cols-3" :
    visible.todo && showMiddle                     ? "grid-cols-2" :
    visible.todo &&                visible.calendar ? "grid-cols-2" :
                   showMiddle &&   visible.calendar ? "grid-cols-2" :
                                                      "grid-cols-1";

  if (!visible.todo && !showMiddle && !visible.calendar) {
    return (
      <div className="h-full flex items-center justify-center opacity-30">
        <p className="text-sm">No widgets visible</p>
      </div>
    );
  }

  return (
    <div className="p-3 h-full overflow-hidden">
      <div className={`grid ${gridClass} gap-3 h-full overflow-hidden`}>
        {visible.todo && <Todo />}

        {showMiddle && (
          <div className="h-full flex flex-col gap-3 overflow-hidden">
            {visible.timer && <TimerWidget />}
            {visible.note && <Note />}
            {visible.shelf && <Shelf />}
          </div>
        )}

        {visible.calendar && <Calendar />}
      </div>
    </div>
  );
}