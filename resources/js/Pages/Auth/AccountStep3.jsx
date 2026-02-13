import { useState } from "react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";

export default function AccountStep3({ onSubmit, onBack, errors, processing, initialData = null }) {
  const [account, setAccount] = useState(
    initialData || {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    }
  );

  const handleChange = (e) => {
    setAccount((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(account);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Step 3: Create Account
        </h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full text-sm font-bold">
            ✓
          </div>
          <div className="h-1 w-8 bg-green-600"></div>
          <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full text-sm font-bold">
            3
          </div>
        </div>
      </div>

      <div>
        <InputLabel htmlFor="name" value="Full Name" />
        <TextInput
          id="name"
          name="name"
          value={account.name}
          onChange={handleChange}
          className="mt-1 block w-full"
          autoComplete="name"
          required
        />
        <InputError message={errors.name} className="mt-2" />
      </div>

      <div>
        <InputLabel htmlFor="email" value="Email Address" />
        <TextInput
          id="email"
          type="email"
          name="email"
          value={account.email}
          onChange={handleChange}
          className="mt-1 block w-full"
          autoComplete="email"
          required
        />
        <InputError message={errors.email} className="mt-2" />
      </div>

      <div>
        <InputLabel htmlFor="password" value="Password" />
        <TextInput
          id="password"
          type="password"
          name="password"
          value={account.password}
          onChange={handleChange}
          className="mt-1 block w-full"
          autoComplete="new-password"
          required
        />
        <InputError message={errors.password} className="mt-2" />
      </div>

      <div>
        <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
        <TextInput
          id="password_confirmation"
          type="password"
          name="password_confirmation"
          value={account.password_confirmation}
          onChange={handleChange}
          className="mt-1 block w-full"
          autoComplete="new-password"
          required
        />
        <InputError message={errors.password_confirmation} className="mt-2" />
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 mt-4">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          ✓ Your account will be created and you'll get your assigned role with permissions
        </p>
      </div>

      <div className="flex items-center justify-between pt-6 border-t dark:border-gray-600">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          ← Back
        </button>

        <PrimaryButton disabled={processing}>
          {processing ? "Creating Account..." : "Create Account"}
        </PrimaryButton>
      </div>
    </form>
  );
}
