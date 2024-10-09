export const input = (icon: Icon, ...props) => {
  return (
    <div className=" relative mb-6">
      <Icon className=" absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" />
      <input className="w--full pl-10 pr-3 bg-gray-800 bg-opacity-50 rounded-lg border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-500  transition duration-200" />
    </div>
  );
};
