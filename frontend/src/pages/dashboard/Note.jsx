import { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";


export default function Note() {
    
    const [userText, saveUserText] = useState('');
    
    return (
        <div className="flex flex-col border-2 border-brd-primary dark:border-brd-primary-dark rounded-xl flex-1 p-4  bg-primary dark:bg-primary-dark">
            <div className="flex justify-between items-center" >
                <p className="font-bold">Sticky Note</p>
                <IoIosAddCircleOutline className="w-6 h-6"/>
            </div>
            <textarea className="flex-1 w-full mt-4"/> 
        </div>
    )
}