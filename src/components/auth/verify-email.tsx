"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Ellipsis } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function VerifyEmailMessage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null;
  }

  return (
    <div className="flex gap-6 w-full md:max-w-lg items-center">
      <Card className="bg-transparent border-none w-full pt-0">
        <CardContent className="flex flex-col justify-center items-center text-center gap-8">
          <Ellipsis className="w-24 h-24 border-3 rounded-full text-white mx-auto stroke-1" />
          <p className="text-white text-wrap text-2xl">
            На пошту{" "}
            <span className="text-blue">
              {user.email}
            </span>{" "}
            було відправлено лист з підтвердженням
          </p>
          <p className="text-gray-500 text-wrap text-xl">
            Після підтвердження електронної адреси перезавантажте сторінку
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
