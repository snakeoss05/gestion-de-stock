import UserManager from "../../components/user-manager/user-manager";

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <UserManager />
      </div>
    </div>
  );
}
