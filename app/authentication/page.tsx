"use client";

import { AccountType, authenticationFields } from "@/_config/accountConfig";
import DynamicCardForm from "@/_elements/cardForm";
import { useLoading } from "@/_elements/loadingScreen";
import { notify } from "@/lib/notifications";
import { useRouter } from "next/navigation";
import { loginAction } from "./actions";
import { useState } from "react";
import UpdatePasswordPage from "@/_elements/updatePassword";

export default function LoginPage() {
  const { startLoading, stopLoading } = useLoading();
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [userId, setUserId] = useState<number>();
  const router = useRouter();

  const handleSubmit = async (values: Record<string, string>) => {
    startLoading("Authenticating...");

    try {
      const account: AccountType = {
        email: values.email,
        password: values.password,
      };

      const result = await loginAction(account);
      console.log("🚀 ~ handleSubmit ~ result:", result);

      if (!result.success) {
        notify.error(result.message as any);
        console.error(result.message);
        return;
      }

      if (result.data?.isFirstLogin) {
        setUserId(result?.data?.accountId);
        setShowUpdatePassword(true);
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

  if (showUpdatePassword) {
    return (
      <UpdatePasswordPage
        accountId={userId || 0}
        onSuccess={() => {
          notify.success("Password updated successfully");

          router.replace("/dashboard");
          router.refresh();
        }}
      />
    );
  }

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
