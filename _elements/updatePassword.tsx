"use client";

import {
  AccountData,
  updatePasswordFields,
  UpdatePasswordType,
} from "@/_config/accountConfig";
import DynamicCardForm from "@/_elements/cardForm";
import { useLoading } from "@/_elements/loadingScreen";
import { updatePasswordAction } from "@/app/authentication/actions";
import { notify } from "@/lib/notifications";
// import { getCurrentUser } from "@/services/account.service";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type UpdatePasswordProps = {
  accountId: number;
  onSuccess: () => void;
};

export default function UpdatePasswordPage({
  accountId,
  onSuccess,
}: UpdatePasswordProps) {
  const { startLoading, stopLoading } = useLoading();
  // const user = await getCurrentUser();
  const router = useRouter();

  const handleSubmit = async (values: Record<string, string>) => {
    console.log("🚀 ~ handleSubmit ~ values:", values);
    console.log(
      "🚀 ~ handleSubmit ~ values.password !== values.confirmPassword:",
      values.password !== values.confirmPassword,
    );
    if (values.password !== values.confirmPassword) {
      notify.error("Password did not match!");
      return;
    }
    try {
      startLoading("Updating password...");
      const newPassword: UpdatePasswordType = {
        id: accountId,
        newPassword: values.password,
      };

      const result = await updatePasswordAction(newPassword);

      if (!result.success) {
        notify.error(result.message as any);
        console.error(result.message);
        return;
      }

      onSuccess();
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
          title="Update Password"
          description="Set your password"
          fields={updatePasswordFields}
          submitLabel="Update Password"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
