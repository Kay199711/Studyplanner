import { IoIosAddCircleOutline } from "react-icons/io";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useState, useEffect } from "react";
import api from "../../api.js";

export default function Resources() {
  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem("classes");
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classToDelete, setClassToDelete] = useState(null);

  const [form, setForm] = useState({
    class_name: "",
    description: "",
    instructor: "",
    schedule: "",
    semester: "",
  });

  useEffect(() => {
    localStorage.setItem("classes", JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    async function fetchResources() {
      try {
        const res = await api.getResources();
        const fetchedClasses = Array.isArray(res) ? res : res?.resources || [];

        if (fetchedClasses.length > 0 && classes.length === 0) {
          setClasses(fetchedClasses);
        }
      } catch (err) {
        console.error("Error fetching resources:", err);
      }
    }

    fetchResources();
  }, []);

  const handleSubmit = async () => {
    if (!form.class_name.trim()) return;

    const tempClass = {
      resource_id: `temp-${Date.now()}`,
      class_name: form.class_name,
      description: form.description,
      instructor: form.instructor,
      schedule: form.schedule,
      semester: form.semester,
    };

    setClasses((prev) => [...prev, tempClass]);

    const savedForm = { ...form };

    setForm({
      class_name: "",
      description: "",
      instructor: "",
      schedule: "",
      semester: "",
    });

    setIsModalOpen(false);

    try {
      const newResource = await api.createResources(
        savedForm.class_name,
        savedForm.description,
        savedForm.instructor,
        savedForm.schedule,
        savedForm.semester
      );

      setClasses((prev) =>
        prev.map((item) =>
          item.resource_id === tempClass.resource_id
            ? {
                resource_id:
                  newResource?.resource_id || newResource?.id || item.resource_id,
                class_name: newResource?.class_name || item.class_name,
                description: newResource?.description || item.description,
                instructor: newResource?.instructor || item.instructor,
                schedule: newResource?.schedule || item.schedule,
                semester: newResource?.semester || item.semester,
              }
            : item
        )
      );
    } catch (err) {
      console.error("Error saving resource to backend:", err);
    }
  };

  const handleDelete = async () => {
    if (!classToDelete) return;

    const idToDelete = classToDelete.resource_id || classToDelete.id;

    setClasses((prev) =>
      prev.filter((item) => (item.resource_id || item.id) !== idToDelete)
    );

    if (
      selectedClass &&
      (selectedClass.resource_id || selectedClass.id) === idToDelete
    ) {
      setSelectedClass(null);
    }

    try {
      if (
        idToDelete &&
        typeof idToDelete === "string" &&
        !idToDelete.startsWith("temp-")
      ) {
        await api.deleteResources(idToDelete);
      }
    } catch (err) {
      console.error("Error deleting resource from backend:", err);
    }

    setClassToDelete(null);
  };

  return (
    <div className="p-4">
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/45 flex justify-center items-center z-50">
          <div className="p-6 w-96 flex flex-col gap-3 border bg-gray-100 dark:bg-primary-dark border-brd-primary dark:border-brd-primary-dark rounded-lg">
            <div className="flex justify-between items-center w-full">
              <h2 className="font-semibold text-lg">Enter Class Information</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <IoIosCloseCircleOutline className="w-6 h-6 cursor-pointer hover:text-red-500" />
              </button>
            </div>

            <input
              type="text"
              value={form.class_name}
              onChange={(e) =>
                setForm({ ...form, class_name: e.target.value })
              }
              placeholder="Class Name"
              className="font-bold text-2xl text-black-900"
            />

            <div className="flex flex-col gap-1 mb-3">
              <input
                type="text"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Description"
                className="text-black-900"
              />

              <input
                type="text"
                value={form.instructor}
                onChange={(e) =>
                  setForm({ ...form, instructor: e.target.value })
                }
                placeholder="Instructor"
                className="text-black-900"
              />

              <input
                type="text"
                value={form.schedule}
                onChange={(e) =>
                  setForm({ ...form, schedule: e.target.value })
                }
                placeholder="Schedule"
                className="text-black-900"
              />

              <input
                type="text"
                value={form.semester}
                onChange={(e) =>
                  setForm({ ...form, semester: e.target.value })
                }
                placeholder="Semester"
                className="text-black-900"
              />
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

      {selectedClass && (
        <div className="fixed inset-0 bg-black/45 flex justify-center items-center z-50">
          <div className="p-6 w-96 flex flex-col gap-3 border bg-gray-100 dark:bg-primary-dark border-brd-primary dark:border-brd-primary-dark rounded-lg">
            <div className="flex justify-between items-center w-full">
              <h2 className="font-semibold text-lg">Class Details</h2>
              <button onClick={() => setSelectedClass(null)}>
                <IoIosCloseCircleOutline className="w-6 h-6 cursor-pointer hover:text-red-500" />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-base">
              <div>
                <span className="font-semibold">Class:</span>{" "}
                {selectedClass.class_name}
              </div>
              <div>
                <span className="font-semibold">Description:</span>{" "}
                {selectedClass.description}
              </div>
              <div>
                <span className="font-semibold">Instructor:</span>{" "}
                {selectedClass.instructor}
              </div>
              <div>
                <span className="font-semibold">Schedule:</span>{" "}
                {selectedClass.schedule}
              </div>
              <div>
                <span className="font-semibold">Semester:</span>{" "}
                {selectedClass.semester}
              </div>
            </div>
          </div>
        </div>
      )}

      {classToDelete && (
        <div className="fixed inset-0 bg-black/45 flex justify-center items-center z-50">
          <div className="p-6 w-96 flex flex-col gap-4 border bg-gray-100 dark:bg-primary-dark border-brd-primary dark:border-brd-primary-dark rounded-lg">
            <div className="flex justify-between items-center w-full">
              <h2 className="font-semibold text-lg">Delete Class</h2>
              <button onClick={() => setClassToDelete(null)}>
                <IoIosCloseCircleOutline className="w-6 h-6 cursor-pointer hover:text-red-500" />
              </button>
            </div>

            <p className="text-base">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{classToDelete.class_name}</span>?
            </p>

            <div className="flex gap-2">
              <button
                className="flex-1 px-3 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 cursor-pointer"
                onClick={() => setClassToDelete(null)}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="border-2 border-brd-primary dark:border-brd-primary-dark rounded-xl flex-1 p-4 bg-primary dark:bg-primary-dark mt-0.5">
        <div className="flex justify-between items-center font-bold text-2xl w-full text-black-900 border-b border-brd-primary dark:border-brd-primary-dark pb-3">
          Your Classes
          <button
            className="cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <IoIosAddCircleOutline className="p-1 w-10 h-10 hover:text-blue-500" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {classes.map((item, index) => (
            <div
              key={item.resource_id || item.id || index}
              onClick={() => setSelectedClass(item)}
              className="relative mt-4 p-2 rounded-lg w-full h-32 bg-[#D9D9D9] flex items-center justify-center text-center font-semibold text-lg cursor-pointer hover:shadow-md"
            >
              <button
                className="absolute top-2 right-2 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setClassToDelete(item);
                }}
              >
                <IoIosCloseCircleOutline className="w-5 h-5 cursor-pointer hover:text-red-500" />
              </button>

              {item.class_name}
            </div>
          ))}
        </div>
      </div>

      <div className="border-2 border-brd-primary dark:border-brd-primary-dark rounded-xl flex-1 p-4 bg-primary dark:bg-primary-dark mt-5">
        <div className="flex flex-col">
          <div className="font-bold text-2xl">Documents</div>
          <div className="flex gap-2 mt-4 ml-1">
            <div className="border rounded-md h-full p-4 cursor-pointer"></div>
            <div className="border rounded-md h-full p-4 cursor-pointer"></div>
          </div>
        </div>

        <div className="border-b border-brd-primary dark:border-brd-primary-dark p-2"></div>

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