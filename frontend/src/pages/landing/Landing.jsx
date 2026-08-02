import LoginRegister from './LoginRegister';
import { BiBookReader } from "react-icons/bi";
import Beams from '../../components/Beams';

export default function Landing() {
    return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
            {/* Background Beams */}
            <div className="absolute inset-0 w-full z-0 pointer-events-none">
        <Beams
          beamWidth={4}
          beamHeight={30}
          beamNumber={20}
          lightColor="#ffffff"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={30}
        />
      </div>

      {/* Content on top of Beams */}
    <div className="relative z-10 flex h-screen overflow-hidden text-txt-primary dark:text-txt-primary-dark">
            {/* Left Hero Section */}

            <div className="hidden md:flex md:w-3/5 flex-col justify-center px-12">
                <div className="max-w-xl space-y-6">
                    {/* Logo/Icon */}
                    <div className="flex items-center gap-3 mb-8">
                        <BiBookReader className="w-12 h-12 text-icon dark:text-icon-dark" />
                        <h1 className="text-5xl font-bold [text-shadow:0_2px_12px_rgba(255,255,255,0.55)]">Study Planner</h1>
                    </div>

                    {/* Tagline */}
                    <h2 className="text-2xl font-medium text-txt-primary dark:text-txt-primary-dark [text-shadow:0_1px_8px_rgba(255,255,255,0.5)]">
                        Organize your academic life with ease
                    </h2>
                </div>
            </div>

            {/* Right Login Section */}
            <div className="flex w-full md:w-2/5 flex-col items-center justify-center px-6 md:px-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo - only shown on small screens */}
                    <div className="flex md:hidden items-center justify-center gap-2 mb-8">
                        <BiBookReader className="w-8 h-8 text-icon dark:text-icon-dark" />
                        <h1 className="text-3xl font-bold [text-shadow:0_2px_10px_rgba(255,255,255,0.55)]">Study Planner</h1>
                    </div>
                    
                    <LoginRegister />
                </div>
            </div>
        </div>
    </div>
    );
}