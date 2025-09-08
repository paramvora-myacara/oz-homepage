"use client";

export default function PhoneOptinPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Register for Updates
          </h1>
          <div className="w-full aspect-[3/4] min-h-[700px]">
            <iframe
              src="https://api.leadconnectorhq.com/widget/form/jxc0kd0ln52VzLovnUle?notrack=true"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 'none' }}
              title="Registration Form"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
