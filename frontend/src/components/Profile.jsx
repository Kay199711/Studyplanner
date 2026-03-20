import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { CiEdit } from "react-icons/ci";

export default function ProfilePage() {
  const {user} = useAuth();
  const [showColors, setShowColors] = useState(false);
  const [avatarColor, setAvatarColor] = useState('bg-blue-300');
  
  return (
    <div className="p-10 pl-20">
      <div className="relative w-16 h-16 mb-4">
      <div 
        onClick={() => setShowColors(!showColors)} 
        className={`w-16 h-16 rounded-full ${avatarColor} dark:bg-hover-dark flex items-center justify-center text-2xl font-semibold mb-4, cursor-pointer`}
      >
      {user?.name?.charAt(0).toUpperCase()}
      </div>

      <div className = "absolute bottom-0 right-0 bg-white dark:bg-primary-dark rounded-full p-0.5 border border-brd-primary dark:border-brd-primary">
        <CiEdit className="w-3 h-3 text-icon dark:text-icon-dark"/>
      </div>

      {showColors &&(
        <div className="absolute top-20 left-0 z-10 bg-primary dark:bg-primary-dark border border-brd-primary dark:border-brd-primary-dark rounded-lg p-3 shadow-md flex gap-2">
          <button onClick = {() => {setAvatarColor('bg-blue-300'); setShowColors(false);}} className="border w-6 h-6 rounded-full bg-blue-300 cursor-pointer" />
          <button onClick = {() => {setAvatarColor('bg-red-200'); setShowColors(false);}} className="border w-6 h-6 rounded-full bg-red-300 cursor-pointer"/>
          <button onClick = {() => {setAvatarColor('bg-green-300'); setShowColors(false);}} className="border w-6 h-6 rounded-full bg-green-300 cursor-pointer"/>
          <button onClick = {() => {setAvatarColor('bg-orange-200'); setShowColors(false);}} className="border w-6 h-6 rounded-full bg-orange-300 cursor-pointer"/>
        </div>
      )}
      </div>

      <h1 className="text-2xl font-semibold mb-6">Profile Settings</h1>
      <div className = "space-y-4">
        
        <div>
          <p className="text-sm text-icon dark:text-icon-dark">Username</p>
          <p className="font-medium">{user?.name}</p>
          <button onClick={() => {}}className = "text-sm text-blue-500 hover:text-blue-600 cursor-pointer">Change Username</button>
        </div>

        <div>
          <p className="text-sm text-icon dark:text-icon-dark">Email</p>
          <p className="font-medium">{user?.email}</p>
          <button onClick={() => {}}className = "text-sm text-blue-500 hover:text-blue-600 cursor-pointer">Change Email</button>
        </div>

        <div>
          <p className = "text-sm text-icon dark:text-icon-dark">Account Created</p>  
          <p className = "font-medium">{new Date(user?.createdAt).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}</p>  
        </div>
      </div>
    </div>
  );
}