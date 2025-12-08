'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { motion } from "framer-motion"
import LogoImg from "@/public/images/LumaScope Logo 4.png"

export default function Home() {
  const router = useRouter()

  const [email, setEmail] = useState("admin@lukascope.com")
  const [password, setPassword] = useState("password123")
  const [error, setError] = useState("")

  const handleLogin = async () => {
    setError("")

    // Simple demo login check
    if (email === "admin@lukascope.com" && password === "password123") {
      document.cookie = "session=true; path=/"
      router.push("/dashboard")
    } else {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="flex justify-center items-center w-full h-screen p-8 text-black gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="input-contain p-6 flex flex-col justify-center items-center gap-6.5"
      >
        <h1 className="text-7xl text-white">LukaScope</h1>

        <Image
          src={LogoImg}
          alt="Logo"
          width={140}
          height={140}
        />

        <Input
          type="email"
          placeholder="admin@lukascope.com"
          className="text-2xl border-none text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="password123"
          className="text-2xl border-none text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="px-6 py-2.5 text-3xl transition-transform hover:scale-105 active:scale-95 text-white"
        >
          Log In
        </button>

        {error && (
          <p className="text-red-500 text-base">
            {error}
          </p>
        )}
      </motion.div>
    </div>
  )
}
