import { MdDriveFolderUpload } from "react-icons/md";

export default function Shelf() {
    return (
        <div className="flex justify-between border-2 border-brd-primary dark:border-brd-primary-dark rounded-xl flex-1 p-4  bg-primary dark:bg-primary-dark">
            <p className="font-bold">Shelf</p>
            <MdDriveFolderUpload className="w-6 h-6" />
        </div>
    )
}