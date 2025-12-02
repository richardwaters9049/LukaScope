import { Input } from "@/components/ui/input"
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex- justify-center items-center w-full h-screen p-8 bg-black text-white gap-6">

      <div className="input-contain p-6 flex flex-col bg-blue-600 justify-center items-center gap-6.5">
        <h1 className="text-7xl">LukaScope</h1>
        <Input type="email" placeholder="Email" className="border-amber-400 border-2 text-2xl" />
        <Input type="password" placeholder="Password" className="border-red-400 border-2 text-2xl" />
        <Link href={"./dashboard/"} className="px-6 py-2.5 text-3xl bg-purple-700">Log In</Link>
      </div>

    </div>
  );
}
