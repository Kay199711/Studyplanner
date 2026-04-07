import { useEffect, useState } from "react";
import api from "../../api.js";

export default function Resources() {

    const [resources, setResources] = useState([]);

    const[form, setForm] = useState({
        class_name: "",
        description: "",
        instructor: "",
        schedule: "",
        semester: "",
    });

    useEffect(() => {
        async function fetchResources() {
            const res = await api.getResources();
            setResources(res);
        }
        fetchResources();
    }, []);

    const handleSubmit = async () => {
        try {
            const res = await api.createResources(
                form.class_name,
                form.description,
                form.instructor,
                form.schedule,
                form.semester
            );
            console.log("New resource:", res);
            
            setResources([...resources, res]);
            setForm({ class_name: "", description: "", instructor: "", schedule: "", semester: ""});
        } catch (err) {
            console.error("Error: Cannot add resource.", err);
        }
    };

    return (
    /* full page */
      <div className="p-6"> 
        <div className="flex items-start border-2 border-brd-primary dark:border-brd-primary-dark rounded-xl h-full p-4 bg-primary dark:bg-primary-dark gap-3 overflow-hidden">
        {/* content */}
            <div className="flex flex-col w-full h-full p-2 gap-2">

        {/* Class information */}
            <input type="text" 
                value={form.class_name} 
                onChange={(e) => setForm({...form, class_name: e.target.value})
                } 
                placeholder="Class Name" 
                className="font-bold text-3xl text-black-900"/>

            <div className="flex flex-col gap-1 ml-1 mb-3">
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

            <button onClick={(e) => {e.preventDefault(); handleSubmit(); }}
            className="mt-3 p-2 bg-blue-500 text-white rounded">
                Add Class
            </button>

            <div className="border"></div>

            <div className="flex flex-col gap-3">
            {resources.map((r) => (
              <div key={r.resource_id} className="border p-3 rounded-lg">
                <div className="font-bold text-xl">{r.class_name}</div>
                <div>{r.description}</div>
                <div><strong>Instructor:</strong> {r.instructor}</div>
                <div><strong>Schedule:</strong> {r.schedule}</div>
                <div><strong>Semester:</strong> {r.semester}</div>
                {/* Display created and updated timestamps */}
                <div className="text-sm text-gray-600 mt-1">
                  Created: {new Date(r.created_at).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  Updated: {new Date(r.updated_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

            {/* Imported sources (documents & videos) displayed */}
            {/* documents section */}
            <div className="flex flex-col">
                <div className="font-bold mt-2 text-2xl">Documents</div>
                <div className="flex gap-2 mt-3 ml-1">
                    <div className="border rounded-sm h-full p-4 cursor-pointer"></div>
                    <div className="border rounded-sm h-full p-4 cursor-pointer"></div>
                </div>
            </div>
            
            {/* videos section */}
            <div className="flex flex-col">
                <div className="font-bold mt-3 text-2xl">Videos</div>
                <div className="flex gap-2 mt-3 ml-1">
                    <div className="border rounded-sm h-full p-4 cursor-pointer"></div>
                    <div className="border rounded-sm h-full p-4 cursor-pointer"></div>
                </div>
            </div>
        </div>
        </div>
      </div>
    );
  }

  