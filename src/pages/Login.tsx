
import LoginForm from "@/components/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Item Removal System</h1>
          <p className="text-gray-600 mt-2">Please log in to continue</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
