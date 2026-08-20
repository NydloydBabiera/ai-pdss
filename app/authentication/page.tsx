"use client";

import { AccountType, authenticationFields } from "@/_config/accountConfig";
import DynamicCardForm from "@/_elements/cardForm";
import { useLoading } from "@/_elements/loadingScreen";
import { loginAction } from "./account";
import { notify } from "@/lib/notifications";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { startLoading, stopLoading } = useLoading();
  const router = useRouter();

  const handleSubmit = async (values: Record<string, string>) => {
    startLoading("Authenticating...");

    try {
      const account: AccountType = {
        email: values.email,
        password: values.password,
      };

      const result = await loginAction(account);

      if (!result.success) {
        notify.error(result.message as any);
        console.error(result.message);
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      notify.error(error as any);
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="flex flex-col  items-center justify-center gap-6 p-6 animate-float-up">
      <div className="flex w-full max-w-md flex-col ">
        <DynamicCardForm
          title="Login"
          description="Sign in to access your accounts"
          fields={authenticationFields}
          submitLabel="Login"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
