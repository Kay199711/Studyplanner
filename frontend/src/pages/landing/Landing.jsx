import LoginRegister from './LoginRegister';
import { BiBookReader } from "react-icons/bi";

export default function Landing() {
    return (
        <div className="flex h-screen overflow-hidden bg-primary dark:bg-primary-dark text-txt-primary dark:text-txt-primary-dark">
            {/* Left Hero Section */}
            <div className="hidden md:flex md:w-3/5 flex-col justify-center px-12 bg-secondary dark:bg-secondary-dark">
                <div className="max-w-xl space-y-6">
                    {/* Logo/Icon */}
                    <div className="flex items-center gap-3 mb-8">
                        <BiBookReader className="w-12 h-12 text-icon dark:text-icon-dark" />
                        <h1 className="text-5xl font-bold">Study Planner</h1>
                    </div>

                    {/* Tagline */}
                    <h2 className="text-2xl font-medium text-txt-primary dark:text-txt-primary-dark">
                        Organize your academic life with ease
                    </h2>
                </div>
            </div>

            {/* Right Login Section */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo - only shown on small screens */}
                    <div className="flex md:hidden items-center justify-center gap-2 mb-8">
                        <BiBookReader className="w-8 h-8 text-icon dark:text-icon-dark" />
                        <h1 className="text-3xl font-bold">Study Planner</h1>
                    </div>
                    
                    <LoginRegister />
                </div>
            </div>
        </div>
    );
}