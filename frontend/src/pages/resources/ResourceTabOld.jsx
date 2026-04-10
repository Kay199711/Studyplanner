// export default function ResourceTab() {
//   const classes = ["class", "class", "class", "class", "class", "class"];

//   return (
//     <div>
//       {/* Search + button */}
//       <div className="flex items-center gap-2">
//         <form>
//           <input
//             className="bg-[#C6C3C3] pl-5 w-88.5 h-12.75 rounded-md outline-none"
//             type="search"
//             placeholder="Search"
//           />
//         </form>

//         <button className="w-12.5 h-11.75 rounded-full bg-[#C9C9C9] text-lg">
//           +
//         </button>
//       </div>

//       {/* Class grid */}
//       <div className="grid grid-cols-3 gap-12.5 mt-7.5">
//         {classes.map((item, index) => (
//           <button
//             key={index}
//             className="w-66.25 h-62 bg-secondary dark:bg-secondary-dark border-0"
//           >
//             {item}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }