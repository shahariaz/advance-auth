import { motion } from "framer-motion";
export const SignUpPage = () => {
  const handleSignUp = (e) => {
    e.preventDefault();
  };
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
        <form onSubmit={handleSignUp}></form>
      </div>
    </motion.div>
  );
};
