import React, { useState } from "react";
import {
  Leaf,
  Activity,
  Loader2,
  ChevronRight,
  Mail,
  Lock,
  AlertCircle,
} from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill all required fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2500));

      console.log({
        email,
        password,
      });

      alert("Login Successful");
    } catch {
      setError("AI Verification Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">

      {/* ================= Background ================= */}

      <div className="absolute inset-0">

        {/* Grid */}

        <div
          className="
          absolute inset-0
          bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),
          linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
          bg-[size:40px_40px]
          "
        />

        {/* Glow 1 */}

        <div
          className="
          absolute
          -top-40
          -left-40
          h-[500px]
          w-[500px]
          rounded-full
          bg-cyan-500/20
          blur-[140px]
          "
        />

        {/* Glow 2 */}

        <div
          className="
          absolute
          bottom-0
          right-0
          h-[500px]
          w-[500px]
          rounded-full
          bg-emerald-500/20
          blur-[140px]
          "
        />

        {/* Glow 3 */}

        <div
          className="
          absolute
          top-1/2
          left-1/2
          h-[400px]
          w-[400px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-purple-500/10
          blur-[120px]
          "
        />
      </div>

      {/* ================= Main ================= */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">

        <div className="w-full max-w-md">

          {/* ================= Logo ================= */}

          <div className="mb-10 text-center">

            <div
              className="
              relative
              mx-auto
              mb-6
              flex
              h-24
              w-24
              items-center
              justify-center
              rounded-3xl
              bg-gradient-to-br
              from-cyan-500
              to-emerald-500
              shadow-[0_0_50px_rgba(0,245,160,.35)]
              animate-pulse
              "
            >
              <Leaf size={42} />

              <div
                className="
                absolute
                -right-2
                -top-2
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                bg-black
                "
              >
                <Activity
                  size={16}
                  className="text-emerald-400 animate-pulse"
                />
              </div>
            </div>

            <h1 className="text-4xl font-bold">
              AgriCore{" "}
              <span className="text-emerald-400">AI</span>
            </h1>

            <p className="mt-3 text-slate-400">
              Intelligent Crop Disease Detection Platform
            </p>
          </div>

          {/* ================= Card ================= */}

          <div
            className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-white/5
            p-8
            backdrop-blur-2xl
            shadow-2xl
            "
          >

            {/* Overlay */}

            <div
              className="
              absolute
              inset-0
              opacity-10
              bg-[radial-gradient(circle_at_center,#00F5A0_1px,transparent_1px)]
              bg-[size:20px_20px]
              "
            />

            <div className="relative z-10">

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Email */}

                <div>

                  <label className="mb-2 block text-sm text-slate-400">
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail
                      className={`absolute left-4 top-4 h-5 w-5 ${
                        focusedField === "email"
                          ? "text-cyan-400"
                          : "text-slate-500"
                      }`}
                    />

                    <input
                      type="email"
                      placeholder="admin@agricore.ai"
                      value={email}
                      onFocus={() =>
                        setFocusedField("email")
                      }
                      onBlur={() =>
                        setFocusedField("")
                      }
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      className="
                      w-full
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/5
                      py-4
                      pl-12
                      pr-4
                      text-white
                      placeholder:text-slate-500
                      backdrop-blur-lg
                      transition-all
                      duration-300
                      focus:border-cyan-400
                      focus:outline-none
                      focus:ring-2
                      focus:ring-cyan-400/20
                      "
                    />
                  </div>
                </div>

                {/* Password */}

                <div>

                  <label className="mb-2 block text-sm text-slate-400">
                    Password
                  </label>

                  <div className="relative">

                    <Lock
                      className={`absolute left-4 top-4 h-5 w-5 ${
                        focusedField === "password"
                          ? "text-cyan-400"
                          : "text-slate-500"
                      }`}
                    />

                    <input
                      type="password"
                      placeholder="••••••••••"
                      value={password}
                      onFocus={() =>
                        setFocusedField("password")
                      }
                      onBlur={() =>
                        setFocusedField("")
                      }
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      className="
                      w-full
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/5
                      py-4
                      pl-12
                      pr-4
                      text-white
                      placeholder:text-slate-500
                      backdrop-blur-lg
                      transition-all
                      duration-300
                      focus:border-cyan-400
                      focus:outline-none
                      focus:ring-2
                      focus:ring-cyan-400/20
                      "
                    />
                  </div>
                </div>

                {/* Error */}

                {error && (
                  <div
                    className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-red-500/20
                    bg-red-500/10
                    p-3
                    text-red-300
                    "
                  >
                    <AlertCircle size={18} />
                    {error}
                  </div>
                )}

                {/* Remember */}

                <div className="flex items-center justify-between">

                  <label className="flex items-center gap-2 text-sm text-slate-400">

                    <input
                      type="checkbox"
                      className="accent-emerald-500"
                    />

                    Remember Me
                  </label>

                  <button
                    type="button"
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                  group
                  relative
                  w-full
                  overflow-hidden
                  rounded-2xl
                  bg-gradient-to-r
                  from-cyan-500
                  via-emerald-500
                  to-cyan-500
                  py-4
                  font-semibold
                  transition-all
                  duration-500
                  hover:scale-[1.02]
                  hover:shadow-[0_0_50px_rgba(0,245,160,.4)]
                  "
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">

                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" />
                        AI Verifying Identity...
                      </>
                    ) : (
                      <>
                        Access AI Platform
                        <ChevronRight size={18} />
                      </>
                    )}
                  </span>

                  <div
                    className="
                    absolute
                    inset-0
                    -translate-x-full
                    bg-gradient-to-r
                    from-transparent
                    via-white/20
                    to-transparent
                    transition-transform
                    duration-1000
                    group-hover:translate-x-full
                    "
                  />
                </button>

              </form>
            </div>
          </div>

          {/* Footer */}

          <p className="mt-8 text-center text-slate-500">
            Powered by Advanced AI Agriculture Intelligence
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;