import { motion } from "framer-motion";
import InputFiled from "../components/InputFiled";
import { Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
export const SignUpPage = () => {
  const handleSignUp = (e) => {
    e.preventDefault();
  };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <motion.div
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter
      backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden "
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-red-400 to-green-400 text-transparent bg-clip-text">
          Create Account
        </h2>
        <form onSubmit={handleSignUp}>
          <InputFiled
            icon={User}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputFiled
            icon={Mail}
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputFiled
            icon={Lock}
            type="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* Password Strenth meter */}
          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:ring-2 focus:ring-green-500 focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            whileFocus={{ scale: 1.05 }}
            type="submit"
          >
            Sign Up
          </motion.button>
        </form>
        <div className=" px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center ">
          <p className=" text-sm text-gray-400">Already have an account?</p>
          <Link to={"/login"} className="text-green-400 hover:underline">
            LOGIN
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
