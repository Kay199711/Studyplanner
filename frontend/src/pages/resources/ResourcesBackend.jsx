// import { useEffect, useState } from "react";
// import api from "../../api.js";

//my og w backend functionality
// export default function ResourcesBackend({ onAddClass }) {

//     // const [resources, setResources] = useState([]);

//     // useEffect(() => {
//     //     async function fetchResources() {
//     //         const res = await api.getResources();
//     //         setResources(res);
//     //     }
//     //     fetchResources();
//     // }, []);

//     return (
//     /* full page */
//       // <div className="p-6"> 
        
//         {/* content */}
//             {/* <div className="flex flex-col w-full h-full p-2 gap-2"> */}
//         {/* Class information
//             <input type="text" 
//                 value={form.class_name} 
//                 onChange={(e) => setForm({...form, class_name: e.target.value})
//                 } 
//                 placeholder="Class Name" 
//                 className="font-bold text-2xl text-txt-primary dark:text-txt-primary-dark"/>

//             <div className="flex flex-col gap-1 mb-3">
//                 <input type="text"
//                     value={form.description}
//                     onChange={(e) => 
//                         setForm({...form, description: e.target.value})
//                     }
//                     placeholder="Description"
//                     className="text-txt-primary dark:text-txt-primary-dark"/>

//                 <input type="text"
//                     value={form.instructor}
//                     onChange={(e) => 
//                     setForm({...form, instructor: e.target.value})
//                     }
//                     placeholder="Instructor"
//                     className="text-txt-primary dark:text-txt-primary-dark"/>

//                 <input type="text"
//                     value={form.schedule}
//                     onChange={(e) => 
//                     setForm({...form, schedule: e.target.value})
//                     }
//                     placeholder="Schedule"
//                     className="text-txt-primary dark:text-txt-primary-dark"/>

//                 <input type="text"
//                     value={form.semester}
//                     onChange={(e) => 
//                     setForm({...form, semester: e.target.value})
//                     }
//                     placeholder="Semester"
//                     className="text-txt-primary dark:text-txt-primary-dark"/>
//             // </div> }*/

//             <div className="flex flex-col gap-3">
//             {resources.map((r) => (
//               <div key={r.resource_id} className="border p-3 rounded-lg">
//                 <div className="font-bold text-xl">{r.class_name}</div>
//                 <div>{r.description}</div>
//                 <div><strong>Instructor:</strong> {r.instructor}</div>
//                 <div><strong>Schedule:</strong> {r.schedule}</div>
//                 <div><strong>Semester:</strong> {r.semester}</div>
//                 {/* Display created and updated timestamps */}
//                 <div className="text-sm text-gray-600 mt-1">
//                   Created: {new Date(r.created_at).toLocaleString()}
//                 </div>
//                 <div className="text-sm text-gray-600">
//                   Updated: {new Date(r.updated_at).toLocaleString()}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

  