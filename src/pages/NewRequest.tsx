
import AppLayout from "@/components/AppLayout";
import RemovalRequestForm from "@/components/RemovalRequestForm";

const NewRequest = () => {
  return (
    <AppLayout>
      <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold">New Removal Request</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Fill out the form below to submit a new item removal request.
        </p>
        <RemovalRequestForm />
      </div>
    </AppLayout>
  );
};

export default NewRequest;
