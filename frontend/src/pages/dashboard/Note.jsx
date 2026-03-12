import { IoIosAddCircleOutline } from "react-icons/io";

export default function Note() {
    return (
        <div className="flex justify-between border-2 border-brd-primary dark:border-brd-primary-dark rounded-xl flex-1 p-4  bg-primary dark:bg-primary-dark">
            <p className="font-bold">Sticky Note</p>
            <IoIosAddCircleOutline className="w-6 h-6"/>
        </div> 
    )
}