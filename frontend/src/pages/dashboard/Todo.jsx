import { IoIosAddCircleOutline } from "react-icons/io";

export default function Todo() {
    return (
        <div className="flex justify-between border-2 border-brd-primary dark:border-brd-primary-dark rounded-xl h-full p-4 bg-primary dark:bg-primary-dark">
          <p className="font-bold">To-Do List</p>
          <IoIosAddCircleOutline className="w-6 h-6"/>
        </div>
    )
}