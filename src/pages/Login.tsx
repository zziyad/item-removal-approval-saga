
import LoginForm from "@/components/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Item Removal System</h1>
        <p className="text-gray-600 mt-2">Please log in to continue</p>
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;
