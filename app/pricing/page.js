"use client";
import { useWideHeader } from "../hooks/AppContext";
import Button from "../components/Button";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Pricing() {
  useWideHeader();
  const [isPremium, setIsPremium] = useState(null);
  useEffect(() => {
    axios
      .get("/api/subscription")
      .then((res) =>
        setIsPremium(
          res.data?.stripeSubscriptionData?.object?.status === "active"
        )
      )
      .catch((err) => {
        if (err.response.status === 401) {
          // nothing
        }
      });
  }, []);
  function handleUpgradeButtonClick() {
    axios
      .post("/api/subscription")
      .then((res) => (window.location.href = res.data));
  }
  function handleManageButtonClick() {
    axios.post("/api/portal").then((res) => (window.location.href = res.data));
  }
  return (
    <section className="my-16">
      <h1 className="text-center text-4xl mb-8">Simple pricing</h1>
      <p className="text-center mb-4">Start for free, upgrade when you need</p>
      <div className="grid grid-cols-1 md:grid-cols-none md:flex w-full justify-center gap-2 md:gap-8">
        <div className="flex text-center items-center gap-1 grow md:grow-0 justify-center">
          <div className="bg-rose-300 w-6 h-6 rounded-full flex items-center justify-center">
            ✓
          </div>
          Unlimited users
        </div>
        <div className="flex text-center items-center gap-1 grow md:grow-0 justify-center">
          <div className="bg-rose-300 w-6 h-6 rounded-full flex items-center justify-center">
            ✓
          </div>
          Unlimited content
        </div>
        <div className="flex text-center items-center gap-1 grow md:grow-0 justify-center">
          <div className="bg-rose-300 w-6 h-6 rounded-full flex items-center justify-center">
            ✓
          </div>
          Unlimited admins
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-8 mt-8 md:mt-16 text-center md:text-left">
        <div className="bg-rose-300 bg-opacity-50 rounded-lg p-8">
          <h2 className="text-3xl">Free forever</h2>
          <p className="mb-3">Just the basics</p>
          <h3 className="text-xl">
            <span className="font-bold text-4xl">$0</span>/month
          </h3>
          <ul className="mt-6 inline-block">
            <li className="tick-cercle primary">1 board</li>
            <li className="tick-cercle primary">Single sign on</li>
            <li className="tick-cercle primary">Unlimited admins</li>
            <li className="tick-cercle primary">Unlimited feedbacks</li>
            <li className="tick-cercle primary">Unlimited users</li>
          </ul>
        </div>
        <div className="bg-rose-300 bg-opacity-50 rounded-lg p-8">
          <h2 className="text-3xl">Premium</h2>
          <p className="mb-3">All premium functions</p>
          <h3 className="text-xl">
            <span className="font-bold text-4xl">$19</span>/month
          </h3>
          <ul className="mt-6 inline-block">
            <li className="tick-cercle primary">Everyhing in free</li>
            <li className="tick-cercle primary">Ulimited boards</li>
            <li className="tick-cercle primary">Invite only boards</li>
            <li className="tick-cercle primary">Password protected boards</li>
            <li className="tick-cercle primary">Faster support</li>
          </ul>
          <div>
            {isPremium === false && (
              <Button
                onClick={handleUpgradeButtonClick}
                className="bg-primary text-white w-full justify-center mt-2 py-2"
              >
                Upgrade
              </Button>
            )}
            {isPremium === true && (
              <Button
                onClick={handleManageButtonClick}
                className="border border-black border-opacity-20 text-black text-opacity-70 w-full justify-center mt-2 py-2"
              >
                Manage your subscription
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
