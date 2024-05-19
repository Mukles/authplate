"use client";

import { Button } from "@/components/ui/button";
import getStripe from "@/lib/utils/getStripe";
import { Pin } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import CountUp from "react-countup";

const PricingCard = ({
  item,
  isCounter,
  start,
  toggle,
  active_payment,
}: {
  item: any;
  isCounter: boolean;
  start: boolean;
  toggle: string;
  active_payment: boolean;
}) => {
  const yearlyPrice = item.prices.find(
    (price: any) => price.interval === "year",
  );
  const monthlyPrice = item.prices.find(
    (price: any) => price.interval === "month",
  );
  const { data: session } = useSession();
  const [error, setError] = useState("");
  const handleClick = async (productId: string, interval: string) => {
    try {
      if (!session) {
        throw new Error("You must be signed in to purchase a subscription");
      }
      const res = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        body: JSON.stringify({
          price: productId,
          quantity: interval === "year" ? 1 : 1,
        } as any),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const checkoutSession = await res.json().then((value) => {
        return value.session;
      });

      const stripe = await getStripe();
      const { error } = await stripe!.redirectToCheckout({
        sessionId: checkoutSession.id,
      });
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="mt-6 md:col-6 lg:col-4">
      <div className="rounded-2xl  bg-light">
        <div className="p-8">
          <h3 className="h4 mb-1 font-semibold">{item.name}</h3>
          <span className="h3 inline-flex font-bold text-dark">
            {item.currency}

            {toggle === "monthly" ? (
              monthlyPrice?.amount! / 100
            ) : toggle === "yearly" ? (
              yearlyPrice?.amount! / 100
            ) : (
              <span>
                {isCounter ? (
                  <CountUp
                    start={Number(
                      start
                        ? monthlyPrice?.amount! / 100
                        : yearlyPrice?.amount! / 100,
                    )}
                    end={
                      start
                        ? Number(yearlyPrice?.amount! / 100)
                        : Number(monthlyPrice?.amount! / 100)
                    }
                    duration={0.3}
                  />
                ) : (
                  monthlyPrice?.amount! / 100
                )}
              </span>
            )}
          </span>
          <span className="text-monthly inline">
            {toggle === "monthly"
              ? "/Month"
              : toggle === "yearly"
                ? "/Year"
                : start
                  ? "/Year"
                  : "/Month"}
          </span>
          <p className="mb-4 border-b pb-4">{item.content}</p>
          <ul className="mt-4 mb-6">
            {item.services?.map((service: any, i: any) => (
              <li className="mb-2" key={`service-${i}`}>
                <span className="mr-2">
                  <Pin className="mr-1 inline h-[14px] w-[14px] text-primary" />
                </span>
                {service}
              </li>
            ))}
          </ul>
          {active_payment ? (
            <Button asChild className="w-full font-bold">
              <Link
                href="/dashboard/subscriptions"
                className={`btn block text-center btn-primary`}
              >
                Manage
              </Link>
            </Button>
          ) : (
            <Button
              className="w-full font-bold hover:bg-dark hover:text-light"
              variant={item.featured ? "default" : "outline"}
              onClick={() =>
                handleClick(
                  !start ? monthlyPrice?.id! : yearlyPrice?.id!,
                  !start ? monthlyPrice?.interval! : yearlyPrice?.interval!,
                )
              }
            >
              {item.button_label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
