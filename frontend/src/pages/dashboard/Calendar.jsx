import { IoIosAddCircleOutline } from "react-icons/io";

export default function Calendar() {
    return (
        <div className="flex justify-between border-2 border-brd-primary dark:border-brd-primary-dark rounded-xl h-full p-4 bg-primary dark:bg-primary-dark">
            <p className="font-bold">Calendar</p>
            <IoIosAddCircleOutline className="w-6 h-6"/>
        </div>
    )
}