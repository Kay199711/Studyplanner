import { IoIosAddCircleOutline } from "react-icons/io";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useState, useEffect } from "react";
import api from "../../api.js";

export default function Resources() {

  const [classes, setClasses] = useState([]);
  const [resources, setResources] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
      async function fetchResources() {
          const res = await api.getResources();
          setResources(res);
      }
      fetchResources();
    }, []);

    const addClass = () => {
      if (classes.length < 6) {
        setClasses(prev => [...prev, `Class ${prev.length + 1}`]);
      }
    };

    const[form, setForm] = useState({
      class_name: "",
      description: "",
      instructor: "",
      schedule: "",
      semester: "",
    });

    const handleSubmit = async () => {
    try {
      const newResource = await api.createResources(
          form.class_name,
          form.description,
          form.instructor,
          form.schedule,
          form.semester
      );
      setClasses(prev => [...prev, {
        class_name: form.class_name,
        resource_id: newResource?.resource_id || `temp-${Date.now()}`,
      }
      ]);
      
      setForm({ class_name: "", 
              description: "", 
              instructor: "", 
              schedule: "", 
              semester: ""
      });

      setIsModalOpen(false);
              
    } catch (err) {
        console.error("Error: Cannot add resource.", err);
      }
    };

  return (
    <div className="p-4">

  {/* Pop Up when add button is clicked */}
    {isModalOpen && (
      <div className="fixed inset-0 bg-black/45 flex justify-center items-center z-50">
        <div className="p-6 w-96 flex flex-col gap-3 border bg-primary dark:bg-primary-dark border-brd-primary dark:border-brd-primary-dark rounded-lg">
          
          <div className="flex justify-between items-center w-full">
            <h2 className="font-semibold text-lg">Enter Class Information</h2>
            <button onClick={() => { 
              setIsModalOpen(false); 
              }}
            >
              <IoIosCloseCircleOutline className="w-6 h-6 cursor-pointer hover:text-red-500" />
            </button>
          </div>

        {/* Class information */}
          <input type="text" 
              value={form.class_name} 
              onChange={(e) => setForm({...form, class_name: e.target.value})
              } 
              placeholder="Class Name" 
              className="font-bold text-2xl text-black-900"/>

        <div className="flex flex-col gap-1 mb-3">
          <input type="text"
              value={form.description}
              onChange={(e) => 
                  setForm({...form, description: e.target.value})
              }
              placeholder="Description"
              className="text-black-900"/>

          <input type="text"
              value={form.instructor}
              onChange={(e) => 
              setForm({...form, instructor: e.target.value})
              }
              placeholder="Instructor"
              className="text-black-900"/>

          <input type="text"
              value={form.schedule}
              onChange={(e) => 
              setForm({...form, schedule: e.target.value})
              }
              placeholder="Schedule"
              className="text-black-900"/>

          <input type="text"
              value={form.semester}
              onChange={(e) => 
              setForm({...form, semester: e.target.value})
              }
              placeholder="Semester"
              className="text-black-900"/>
        </div>

          <div className="flex gap-2">
            <button
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
              onClick={handleSubmit}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    )}

      {/* class grid */}
      <div className="border-2 border-brd-primary dark:border-brd-primary-dark rounded-xl flex-1 p-4 bg-primary dark:bg-primary-dark mt-0.5">
        <div className="flex justify-between items-center font-bold text-2xl w-full text-black-900 border-b border-brd-primary dark:border-brd-primary-dark pb-3">
          Your Classes
      
        {/* + button */}
          <button className="cursor-pointer"
            onClick={() => {
              setIsModalOpen(true);
            }}
            >
            <IoIosAddCircleOutline className="p-1 w-10 h-10 hover:text-blue-500" />
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
        {classes.map(item => (
          <div key={item.resource_id}
            className="mt-4 p-2 rounded-lg border-brd-primary dark:border-brd-primary-dark bg-secondary dark:bg-secondary-dark w-full h-32 bg-[#D9D9D9] border-0">
            {item.class_name}
            </div>
        ))}
      </div>
      </div>

      {/* Imported sources (documents & videos) displayed */}
      <div className="border-2 border-brd-primary dark:border-brd-primary-dark rounded-xl flex-1 p-4 bg-primary dark:bg-primary-dark mt-5 ">
      {/* documents section */}
      <div className="flex flex-col">
          <div className="font-bold text-2xl">Documents</div>
          <div className="flex gap-2 mt-4 ml-1">
              <div className="border rounded-md h-full p-4 cursor-pointer"></div>
              <div className="border rounded-md h-full p-4 cursor-pointer"></div>
          </div>
      </div>

      <div className="border-b border-brd-primary dark:border-brd-primary-dark p-2"></div>
      
      {/* videos section */}
      <div className="flex flex-col">
          <div className="font-bold mt-4 text-2xl">Videos</div>
          <div className="flex gap-2 mt-3 ml-1">
              <div className="border rounded-md h-full p-4 cursor-pointer"></div>
              <div className="border rounded-md h-full p-4 cursor-pointer"></div>
          </div>
      </div>
      </div>
    </div>
  );
}